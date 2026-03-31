# 📱 WallpaperCave API Documentation

## Base URL
```
Production: https://your-backend-url.railway.app
Development: http://localhost:5001
```

---

## 🔑 Authentication
No authentication required. API is public and free to use.

---

## 📡 Endpoints

### 1. Get Wallpapers

Fetch wallpapers by keyword with pagination support.

**Endpoint**
```
GET /api/wallpapers
```

**Query Parameters**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| keyword | string | Yes | - | Search keyword (e.g., "nature", "space", "gaming") |
| limit | integer | No | 20 | Number of wallpapers to return (1-50) |
| offset | integer | No | 0 | Pagination offset (0, 20, 40, 60...) |

**Example Request**
```bash
curl "https://your-backend-url.railway.app/api/wallpapers?keyword=nature&limit=20&offset=0"
```

**Success Response (200 OK)**
```json
{
  "success": true,
  "keyword": "nature",
  "count": 20,
  "data": [
    {
      "id": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
      "imageUrl": "https://i.pinimg.com/originals/ab/cd/ef/abcdef123456.jpg",
      "thumbnailUrl": "https://i.pinimg.com/736x/ab/cd/ef/abcdef123456.jpg",
      "title": "Beautiful Nature Landscape",
      "pinUrl": "https://www.pinterest.com/pin/123456789/"
    },
    // ... 19 more wallpapers
  ]
}
```

**Error Response (500 Internal Server Error)**
```json
{
  "success": false,
  "error": "Error message here"
}
```

---

## 📱 Mobile App Integration

### iOS (Swift)

```swift
import Foundation

struct Wallpaper: Codable {
    let id: String
    let imageUrl: String
    let thumbnailUrl: String
    let title: String
    let pinUrl: String
}

struct WallpaperResponse: Codable {
    let success: Bool
    let keyword: String
    let count: Int
    let data: [Wallpaper]
}

class WallpaperAPI {
    static let baseURL = "https://your-backend-url.railway.app"
    
    static func fetchWallpapers(keyword: String, limit: Int = 20, offset: Int = 0, completion: @escaping (Result<WallpaperResponse, Error>) -> Void) {
        
        var components = URLComponents(string: "\(baseURL)/api/wallpapers")!
        components.queryItems = [
            URLQueryItem(name: "keyword", value: keyword),
            URLQueryItem(name: "limit", value: "\(limit)"),
            URLQueryItem(name: "offset", value: "\(offset)")
        ]
        
        guard let url = components.url else {
            completion(.failure(NSError(domain: "Invalid URL", code: -1)))
            return
        }
        
        URLSession.shared.dataTask(with: url) { data, response, error in
            if let error = error {
                completion(.failure(error))
                return
            }
            
            guard let data = data else {
                completion(.failure(NSError(domain: "No data", code: -1)))
                return
            }
            
            do {
                let wallpaperResponse = try JSONDecoder().decode(WallpaperResponse.self, from: data)
                completion(.success(wallpaperResponse))
            } catch {
                completion(.failure(error))
            }
        }.resume()
    }
}

// Usage
WallpaperAPI.fetchWallpapers(keyword: "nature", limit: 20, offset: 0) { result in
    switch result {
    case .success(let response):
        print("Loaded \(response.count) wallpapers")
        // Update UI with response.data
    case .failure(let error):
        print("Error: \(error)")
    }
}
```

### Android (Kotlin)

```kotlin
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.http.GET
import retrofit2.http.Query

data class Wallpaper(
    val id: String,
    val imageUrl: String,
    val thumbnailUrl: String,
    val title: String,
    val pinUrl: String
)

data class WallpaperResponse(
    val success: Boolean,
    val keyword: String,
    val count: Int,
    val data: List<Wallpaper>
)

interface WallpaperAPI {
    @GET("api/wallpapers")
    suspend fun getWallpapers(
        @Query("keyword") keyword: String,
        @Query("limit") limit: Int = 20,
        @Query("offset") offset: Int = 0
    ): WallpaperResponse
}

object RetrofitClient {
    private const val BASE_URL = "https://your-backend-url.railway.app/"
    
    val api: WallpaperAPI by lazy {
        Retrofit.Builder()
            .baseUrl(BASE_URL)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
            .create(WallpaperAPI::class.java)
    }
}

// Usage in ViewModel
class WallpaperViewModel : ViewModel() {
    fun loadWallpapers(keyword: String, offset: Int = 0) {
        viewModelScope.launch {
            try {
                val response = RetrofitClient.api.getWallpapers(keyword, 20, offset)
                if (response.success) {
                    // Update UI with response.data
                    println("Loaded ${response.count} wallpapers")
                }
            } catch (e: Exception) {
                println("Error: ${e.message}")
            }
        }
    }
}
```

### React Native

```javascript
import axios from 'axios';

const API_BASE_URL = 'https://your-backend-url.railway.app';

export const fetchWallpapers = async (keyword, limit = 20, offset = 0) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/wallpapers`, {
      params: { keyword, limit, offset },
      timeout: 15000
    });
    
    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error('Failed to fetch wallpapers');
    }
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Usage in component
import React, { useState, useEffect } from 'react';
import { View, FlatList, Image } from 'react-native';

const WallpaperScreen = () => {
  const [wallpapers, setWallpapers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);

  const loadWallpapers = async (isLoadMore = false) => {
    setLoading(true);
    try {
      const data = await fetchWallpapers('nature', 20, isLoadMore ? offset : 0);
      setWallpapers(prev => isLoadMore ? [...prev, ...data] : data);
      if (isLoadMore) setOffset(prev => prev + 20);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWallpapers();
  }, []);

  return (
    <FlatList
      data={wallpapers}
      renderItem={({ item }) => (
        <Image source={{ uri: item.thumbnailUrl }} style={{ width: 200, height: 300 }} />
      )}
      keyExtractor={item => item.id}
      onEndReached={() => loadWallpapers(true)}
      onEndReachedThreshold={0.5}
    />
  );
};
```

### Flutter (Dart)

```dart
import 'dart:convert';
import 'package:http/http.dart' as http;

class Wallpaper {
  final String id;
  final String imageUrl;
  final String thumbnailUrl;
  final String title;
  final String pinUrl;

  Wallpaper({
    required this.id,
    required this.imageUrl,
    required this.thumbnailUrl,
    required this.title,
    required this.pinUrl,
  });

  factory Wallpaper.fromJson(Map<String, dynamic> json) {
    return Wallpaper(
      id: json['id'],
      imageUrl: json['imageUrl'],
      thumbnailUrl: json['thumbnailUrl'],
      title: json['title'],
      pinUrl: json['pinUrl'],
    );
  }
}

class WallpaperAPI {
  static const String baseUrl = 'https://your-backend-url.railway.app';

  static Future<List<Wallpaper>> fetchWallpapers({
    required String keyword,
    int limit = 20,
    int offset = 0,
  }) async {
    final uri = Uri.parse('$baseUrl/api/wallpapers').replace(
      queryParameters: {
        'keyword': keyword,
        'limit': limit.toString(),
        'offset': offset.toString(),
      },
    );

    final response = await http.get(uri);

    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      if (data['success']) {
        return (data['data'] as List)
            .map((json) => Wallpaper.fromJson(json))
            .toList();
      }
    }
    throw Exception('Failed to load wallpapers');
  }
}

// Usage
void loadWallpapers() async {
  try {
    final wallpapers = await WallpaperAPI.fetchWallpapers(
      keyword: 'nature',
      limit: 20,
      offset: 0,
    );
    print('Loaded ${wallpapers.length} wallpapers');
  } catch (e) {
    print('Error: $e');
  }
}
```

---

## 🎯 Categories

Recommended keywords for categories:

```javascript
const categories = [
  'nature wallpaper',
  'abstract wallpaper',
  'space wallpaper',
  'city wallpaper',
  'ocean wallpaper',
  'mountains wallpaper',
  'cars wallpaper',
  'gaming wallpaper',
  'anime wallpaper',
  'minimal wallpaper',
  'dark wallpaper',
  'sunset wallpaper',
  'forest wallpaper',
  'beach wallpaper'
];
```

---

## 📊 Response Fields

### Wallpaper Object

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique identifier (32-character hash) |
| imageUrl | string | Full resolution image URL (originals/) |
| thumbnailUrl | string | Optimized thumbnail URL (736x/) |
| title | string | Wallpaper title/description |
| pinUrl | string | Source Pinterest URL |

---

## ⚡ Performance Tips

### 1. Caching
The API caches responses for 1 hour. Same requests return cached data instantly.

### 2. Pagination
- Start with `offset=0`
- Load 20 wallpapers at a time
- Increment offset by 20 for next page: `offset=20`, `offset=40`, etc.
- Maximum recommended offset: 1000

### 3. Image Loading
- Use `thumbnailUrl` for lists/grids (faster loading)
- Use `imageUrl` for full-screen view/download
- Implement lazy loading in your app

### 4. Error Handling
- Implement retry logic with exponential backoff
- Handle timeout errors (API may take 5-10 seconds for first request)
- Cache responses locally in your app

---

## 🔒 Rate Limiting

Currently no rate limiting, but recommended best practices:
- Don't make more than 10 requests per second
- Implement client-side caching
- Use pagination instead of loading all at once

---

## 🐛 Common Issues

### Issue 1: Slow First Request
**Cause**: Puppeteer needs to load Pinterest page
**Solution**: Show loading indicator, typical wait is 5-10 seconds

### Issue 2: Empty Results
**Cause**: Pinterest may not have results for that keyword at that offset
**Solution**: Try different keyword or lower offset

### Issue 3: CORS Error (Web Only)
**Cause**: Your domain not in allowed origins
**Solution**: Contact API admin to whitelist your domain

### Issue 4: Timeout
**Cause**: Request taking longer than 15 seconds
**Solution**: Increase timeout or retry

---

## 📱 Mobile App Checklist

- [ ] Implement pagination/infinite scroll
- [ ] Cache images locally
- [ ] Handle loading states
- [ ] Handle errors gracefully
- [ ] Show skeleton/placeholder while loading
- [ ] Implement pull-to-refresh
- [ ] Add favorites/bookmarks feature
- [ ] Implement image download
- [ ] Add share functionality
- [ ] Test on slow networks

---

## 🎨 UI/UX Recommendations

1. **Grid Layout**: 2-3 columns on mobile
2. **Image Aspect Ratio**: Maintain original aspect ratio
3. **Loading**: Show skeleton cards while loading
4. **Empty State**: Show message when no results
5. **Error State**: Show retry button on error
6. **Infinite Scroll**: Load more at 70% scroll
7. **Image Quality**: Use thumbnailUrl for grid, imageUrl for full view

---

## 📞 Support

For API issues or questions:
- Check server logs
- Verify backend is running
- Test with curl/Postman first
- Check CORS configuration

---

## 🚀 Example Mobile App Flow

```
1. App Launch
   ↓
2. Load Random Category (e.g., "nature wallpaper")
   ↓
3. Display 20 wallpapers in grid
   ↓
4. User scrolls to bottom
   ↓
5. Load next 20 (offset=20)
   ↓
6. Append to grid
   ↓
7. Repeat until offset=1000 or no more results
```

---

**API is ready for mobile app integration! 🎉**
