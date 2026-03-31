# 🧪 API Testing Guide

## Quick Test with cURL

### 1. Health Check
```bash
curl http://localhost:5001/api/health
```

**Expected Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-03-31T12:00:00.000Z",
  "uptime": 123.45,
  "environment": "development"
}
```

### 2. API Info
```bash
curl http://localhost:5001/api
```

### 3. Get Wallpapers
```bash
curl "http://localhost:5001/api/wallpapers?keyword=nature&limit=20&offset=0"
```

---

## Test with Postman

1. **Import Collection**
   - Open Postman
   - Click "Import"
   - Select `WallpaperCave_API.postman_collection.json`

2. **Set Base URL**
   - Development: `http://localhost:5001`
   - Production: `https://your-backend-url.railway.app`

3. **Run Tests**
   - Health Check
   - API Info
   - Get Wallpapers (various categories)

---

## Test Endpoints

### ✅ Health Check
```
GET /api/health
```
Tests if server is running.

### 📋 API Info
```
GET /api
```
Returns API information and available categories.

### 🖼️ Get Wallpapers
```
GET /api/wallpapers?keyword=nature&limit=20&offset=0
```

**Parameters:**
- `keyword` (required): Search term
- `limit` (optional): 1-50, default 20
- `offset` (optional): 0+, default 0

---

## Mobile App Testing

### iOS (Swift)
```swift
// Test in Xcode Playground or iOS Simulator
WallpaperAPI.fetchWallpapers(keyword: "nature", limit: 20, offset: 0) { result in
    switch result {
    case .success(let response):
        print("✅ Success: \(response.count) wallpapers")
    case .failure(let error):
        print("❌ Error: \(error)")
    }
}
```

### Android (Kotlin)
```kotlin
// Test in Android Studio
lifecycleScope.launch {
    try {
        val response = RetrofitClient.api.getWallpapers("nature", 20, 0)
        println("✅ Success: ${response.count} wallpapers")
    } catch (e: Exception) {
        println("❌ Error: ${e.message}")
    }
}
```

### React Native
```javascript
// Test in Expo or React Native app
fetchWallpapers('nature', 20, 0)
  .then(data => console.log('✅ Success:', data.length, 'wallpapers'))
  .catch(error => console.log('❌ Error:', error));
```

---

## Expected Response Times

| Request Type | Expected Time |
|-------------|---------------|
| Health Check | < 50ms |
| API Info | < 50ms |
| First Wallpaper Request | 5-10 seconds |
| Cached Request | < 100ms |
| Subsequent Requests | 3-8 seconds |

---

## Test Scenarios

### Scenario 1: Basic Fetch
```bash
curl "http://localhost:5001/api/wallpapers?keyword=nature&limit=20&offset=0"
```
**Expected**: 20 wallpapers returned

### Scenario 2: Pagination
```bash
# Page 1
curl "http://localhost:5001/api/wallpapers?keyword=nature&limit=20&offset=0"

# Page 2
curl "http://localhost:5001/api/wallpapers?keyword=nature&limit=20&offset=20"

# Page 3
curl "http://localhost:5001/api/wallpapers?keyword=nature&limit=20&offset=40"
```
**Expected**: Different wallpapers on each page

### Scenario 3: Cache Test
```bash
# First request (slow)
time curl "http://localhost:5001/api/wallpapers?keyword=space&limit=20&offset=0"

# Second request (fast - cached)
time curl "http://localhost:5001/api/wallpapers?keyword=space&limit=20&offset=0"
```
**Expected**: Second request much faster

### Scenario 4: Different Categories
```bash
curl "http://localhost:5001/api/wallpapers?keyword=gaming&limit=20&offset=0"
curl "http://localhost:5001/api/wallpapers?keyword=anime&limit=20&offset=0"
curl "http://localhost:5001/api/wallpapers?keyword=minimal&limit=20&offset=0"
```
**Expected**: Different wallpapers for each category

### Scenario 5: Custom Limit
```bash
curl "http://localhost:5001/api/wallpapers?keyword=nature&limit=10&offset=0"
curl "http://localhost:5001/api/wallpapers?keyword=nature&limit=50&offset=0"
```
**Expected**: 10 and 50 wallpapers respectively

### Scenario 6: Error Handling
```bash
# Missing keyword
curl "http://localhost:5001/api/wallpapers?limit=20&offset=0"

# Invalid limit
curl "http://localhost:5001/api/wallpapers?keyword=nature&limit=100&offset=0"
```
**Expected**: Proper error responses

---

## Validation Tests

### ✅ Valid Requests
- `keyword=nature&limit=20&offset=0` ✓
- `keyword=space wallpaper&limit=10&offset=20` ✓
- `keyword=gaming&limit=50&offset=0` ✓

### ❌ Invalid Requests
- No keyword → Returns default "wallpaper"
- `limit=100` → Capped at 50
- `limit=-5` → Set to 1
- `offset=-10` → Set to 0

---

## Performance Benchmarks

Run these tests to check performance:

```bash
# Test 1: First request (cold start)
time curl "http://localhost:5001/api/wallpapers?keyword=test1&limit=20&offset=0"

# Test 2: Cached request
time curl "http://localhost:5001/api/wallpapers?keyword=test1&limit=20&offset=0"

# Test 3: Different keyword
time curl "http://localhost:5001/api/wallpapers?keyword=test2&limit=20&offset=0"

# Test 4: Pagination
time curl "http://localhost:5001/api/wallpapers?keyword=test1&limit=20&offset=20"
```

**Target Performance:**
- Cold start: < 10 seconds
- Cached: < 100ms
- New keyword: < 8 seconds
- Pagination: < 5 seconds

---

## Troubleshooting

### Issue: Timeout
**Solution**: Increase timeout to 15-20 seconds

### Issue: Empty Results
**Solution**: Try different keyword or lower offset

### Issue: Slow Performance
**Solution**: Check if Puppeteer is running, restart server

### Issue: CORS Error
**Solution**: Add your domain to allowedOrigins in server.js

---

## Automated Testing Script

Create `test-api.sh`:
```bash
#!/bin/bash

echo "Testing WallpaperCave API..."

# Health check
echo "\n1. Health Check"
curl -s http://localhost:5001/api/health | jq

# API info
echo "\n2. API Info"
curl -s http://localhost:5001/api | jq

# Get wallpapers
echo "\n3. Get Wallpapers"
curl -s "http://localhost:5001/api/wallpapers?keyword=nature&limit=5&offset=0" | jq

echo "\n✅ Tests complete!"
```

Run with:
```bash
chmod +x test-api.sh
./test-api.sh
```

---

**API is ready for testing! 🚀**
