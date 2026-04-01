const express = require('express');
const cors = require('cors');
const puppeteer = require('puppeteer');

const app = express();
const PORT = process.env.PORT || 8080;

// CORS configuration for production
const allowedOrigins = [
  'http://localhost:3000',
  'https://wallpapesrcave.netlify.app',
  'https://wallpapercave.netlify.app',
  'https://your-custom-domain.com',
  process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.some(allowed => origin.startsWith(allowed.replace('*', '')))) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API info endpoint
app.get('/api', (req, res) => {
  res.json({
    name: 'WallpaperCave API',
    version: '2.0.0',
    description: 'High-quality wallpaper discovery API',
    endpoints: {
      health: '/api/health',
      wallpapers: '/api/wallpapers?keyword=nature&limit=20&offset=0'
    },
    documentation: 'https://github.com/your-repo/API_DOCUMENTATION.md',
    categories: [
      'nature', 'abstract', 'space', 'city', 'ocean', 'mountains',
      'cars', 'gaming', 'anime', 'minimal', 'dark', 'sunset', 'forest', 'beach'
    ]
  });
});

// In-memory cache
const cache = new Map();
const CACHE_DURATION = 3600000; // 1 hour in milliseconds

let browser = null;
let page = null;
let isLoggedIn = false;

async function initPinterest() {
  if (isLoggedIn) return;

  console.log('🌐 Starting browser...');
  
  browser = await puppeteer.launch({
    headless: true,
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium',
    args: [
      '--no-sandbox', 
      '--disable-setuid-sandbox', 
      '--window-size=1920,1080',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--disable-gpu',
      '--disable-web-security',
      '--disable-features=VizDisplayCompositor',
      '--disable-background-timer-throttling',
      '--disable-backgrounding-occluded-windows',
      '--disable-renderer-backgrounding'
    ]
  });

  page = await browser.newPage();
  
  // Block unnecessary resources for faster loading
  await page.setRequestInterception(true);
  page.on('request', (req) => {
    const resourceType = req.resourceType();
    if (resourceType === 'stylesheet' || resourceType === 'font') {
      req.abort();
    } else {
      req.continue();
    }
  });
  
  await page.setViewport({ width: 1920, height: 1080 });
  await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

  isLoggedIn = true;
  console.log('✅ Ready!');
}

// Global state to track loaded images per keyword
const loadedImagesCache = new Map();
const lastScrollPosition = new Map();

async function fetchWallpapers(keyword, limit = 20, offset = 0) {
  if (!isLoggedIn) await initPinterest();
  
  const searchUrl = `https://www.pinterest.com/search/pins/?q=${encodeURIComponent(keyword)}`;
  
  // Check if we need to reload the page or continue scrolling
  const cacheKey = `${keyword}_images`;
  let shouldReload = offset === 0;
  
  if (shouldReload) {
    console.log(`🔄 Fresh load for "${keyword}" - Reloading Pinterest page`);
    try {
      await page.goto(searchUrl, { 
        waitUntil: 'domcontentloaded', 
        timeout: 8000 
      });
    } catch (e) {
      console.log('⚠️ Page load timeout, continuing anyway');
    }
    
    // Initial wait for page to load
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // Reset cache for this keyword
    loadedImagesCache.set(cacheKey, new Set());
    lastScrollPosition.set(cacheKey, 0);
    console.log(`🗑️ Cache cleared for "${keyword}"`);
  } else {
    console.log(`♻️ Continuing scroll for "${keyword}" from offset ${offset}`);
  }
  
  const loadedIds = loadedImagesCache.get(cacheKey) || new Set();
  const currentScroll = lastScrollPosition.get(cacheKey) || 0;

  // Scroll more to load new images - always scroll at least 8 times
  const additionalScrolls = Math.max(8, Math.ceil((offset - currentScroll) / 5));
  
  console.log(`📜 Scrolling ${additionalScrolls} more times (current position: ${currentScroll}, target: ${offset})`);
  
  for (let i = 0; i < additionalScrolls; i++) {
    try {
      await page.evaluate(() => {
        window.scrollBy(0, window.innerHeight * 2.5);
      });
      // Wait between scrolls for images to load
      await new Promise(resolve => setTimeout(resolve, 400));
    } catch (scrollError) {
      break;
    }
  }

  // Final wait for all images to load
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Update scroll position
  lastScrollPosition.set(cacheKey, offset + limit);

  let wallpapers = [];
  
  try {
    wallpapers = await page.evaluate((loadedIdsArray) => {
      const images = [];
      const seenUrls = new Set(loadedIdsArray);
      
      const allImages = document.querySelectorAll('img[src*="pinimg.com"]');
      
      console.log(`Found ${allImages.length} total images on page`);
      
      for (let i = 0; i < allImages.length; i++) {
        const img = allImages[i];
        
        if (!img.src || 
            img.src.includes('data:image') || 
            img.src.includes('videos/thumbnails') ||
            img.src.includes('/60x60/') ||
            img.naturalWidth < 150) {
          continue;
        }
        
        let originalUrl = img.src;
        if (originalUrl.match(/\/\d+x\d*\//)) {
          originalUrl = originalUrl.replace(/\/\d+x\d*\//, '/originals/');
        }
        
        let displayUrl = img.src;
        if (displayUrl.match(/\/\d+x\d*\//)) {
          displayUrl = displayUrl.replace(/\/\d+x\d*\//, '/736x/');
        }
        
        const urlMatch = originalUrl.match(/\/([a-f0-9]{32})\./);
        const uniqueId = urlMatch ? urlMatch[1] : originalUrl;
        
        // Only collect NEW images we haven't seen before
        if (!seenUrls.has(uniqueId)) {
          seenUrls.add(uniqueId);
          
          const pinLink = img.closest('a[href*="/pin/"]');
          
          images.push({
            id: uniqueId,
            imageUrl: originalUrl,
            thumbnailUrl: displayUrl,
            title: img.alt || img.title || 'Wallpaper',
            pinUrl: pinLink ? pinLink.href : '#'
          });
        }
      }
      
      console.log(`Found ${images.length} NEW unique images`);
      return images;
    }, Array.from(loadedIds));
    
    // Add new IDs to cache
    wallpapers.forEach(w => loadedIds.add(w.id));
    loadedImagesCache.set(cacheKey, loadedIds);
    
    // Return only the requested amount
    wallpapers = wallpapers.slice(0, limit);
    
  } catch (evalError) {
    console.error('❌ Eval error:', evalError.message);
    return [];
  }
  
  console.log(`✅ Returning ${wallpapers.length} wallpapers (total unique loaded: ${loadedIds.size})`);
  
  return wallpapers;
}

app.get('/api/wallpapers', async (req, res) => {
  try {
    const keyword = req.query.keyword || 'wallpaper';
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 20, 1), 50); // 1-50 range
    const offset = Math.max(parseInt(req.query.offset) || 0, 0); // Non-negative

    // Validate keyword
    if (!keyword || keyword.trim().length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Keyword is required' 
      });
    }

    // Check cache first
    const cacheKey = `${keyword}:${limit}:${offset}`;
    const cached = cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log(`✅ Cache hit: "${keyword}" (offset: ${offset})`);
      return res.json(cached.data);
    }

    // Fetch fresh data
    console.log(`🔍 Fetching: "${keyword}" (offset: ${offset})`);
    const wallpapers = await fetchWallpapers(keyword, limit, offset);

    const response = {
      success: true,
      keyword: keyword,
      count: wallpapers.length,
      limit: limit,
      offset: offset,
      data: wallpapers
    };

    // Store in cache
    cache.set(cacheKey, {
      data: response,
      timestamp: Date.now()
    });

    // Clean old cache entries (keep last 100)
    if (cache.size > 100) {
      const firstKey = cache.keys().next().value;
      cache.delete(firstKey);
    }

    res.json(response);

  } catch (error) {
    console.error('❌ Error:', error.message);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch wallpapers. Please try again.' 
    });
  }
});

app.listen(PORT, async () => {
  console.log(`\n🚀 Wallpaper API - http://localhost:${PORT}\n`);
  await initPinterest();
  console.log(`\n✅ Server ready!\n`);
});

process.on('SIGINT', async () => {
  if (browser) await browser.close();
  process.exit();
});
