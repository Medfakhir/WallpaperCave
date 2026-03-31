# 🚀 Netlify Deployment Guide for WallpaperCave

## ⚠️ Important: Two-Part Deployment Required

Your WallpaperCave project has **two parts**:
1. **Frontend (React)** - Can be hosted on Netlify ✅
2. **Backend (Node.js + Puppeteer)** - Cannot be hosted on Netlify ❌

### Why Backend Can't Be on Netlify?
- Netlify is for **static sites** and **serverless functions**
- Your backend uses **Puppeteer** (Chrome browser automation)
- Puppeteer needs a full server environment with Chrome/Chromium
- Netlify Functions have size limits and can't run Puppeteer reliably

## 🎯 Recommended Solution

### Option 1: Netlify + Railway (Easiest)
- **Frontend**: Netlify (free)
- **Backend**: Railway (free tier available)
- **Total Cost**: Free to start

### Option 2: Netlify + Render
- **Frontend**: Netlify (free)
- **Backend**: Render (free tier available)
- **Total Cost**: Free to start

### Option 3: All-in-One VPS
- **Both**: DigitalOcean, AWS, Linode ($6-12/month)
- **Benefit**: Full control, better for production

---

## 📦 Option 1: Netlify + Railway (Recommended)

### Part A: Deploy Backend to Railway

1. **Create Railway Account**
   - Go to https://railway.app
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Connect your repository

3. **Configure Backend**
   - Railway will auto-detect Node.js
   - Add environment variables:
     ```
     PORT=5001
     NODE_ENV=production
     ```

4. **Deploy**
   - Railway will automatically deploy
   - Copy your backend URL (e.g., `https://your-app.railway.app`)

### Part B: Deploy Frontend to Netlify

1. **Update API URL in Frontend**

Create `client/.env.production`:
```env
REACT_APP_API_URL=https://your-app.railway.app
```

Update `client/src/App.js`:
```javascript
const API_URL = process.env.REACT_APP_API_URL 
  ? `${process.env.REACT_APP_API_URL}/api/wallpapers`
  : 'http://localhost:5001/api/wallpapers';
```

2. **Create Netlify Account**
   - Go to https://netlify.com
   - Sign up with GitHub

3. **Deploy to Netlify**
   - Click "Add new site" → "Import an existing project"
   - Connect to GitHub
   - Select your repository

4. **Configure Build Settings**
   ```
   Base directory: client
   Build command: npm run build
   Publish directory: client/build
   ```

5. **Add Environment Variables**
   - Go to Site settings → Environment variables
   - Add: `REACT_APP_API_URL` = `https://your-app.railway.app`

6. **Deploy**
   - Click "Deploy site"
   - Wait 2-3 minutes
   - Your site is live!

---

## 📦 Option 2: Netlify + Render

### Part A: Deploy Backend to Render

1. **Create Render Account**
   - Go to https://render.com
   - Sign up with GitHub

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your repository
   - Select root directory

3. **Configure Service**
   ```
   Name: wallpapercave-api
   Environment: Node
   Build Command: npm install
   Start Command: node server.js
   ```

4. **Add Environment Variables**
   ```
   PORT=5001
   NODE_ENV=production
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Copy your backend URL (e.g., `https://wallpapercave-api.onrender.com`)

### Part B: Deploy Frontend to Netlify
(Same as Option 1, Part B above)

---

## 🔧 Code Changes Needed

### 1. Update Backend CORS (server.js)

```javascript
const cors = require('cors');

// Update CORS to allow your Netlify domain
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://your-site.netlify.app',
    'https://wallpapercave.com' // Your custom domain
  ],
  credentials: true
}));
```

### 2. Update Frontend API URL (client/src/App.js)

```javascript
// At the top of the file, after imports
const API_URL = process.env.REACT_APP_API_URL 
  ? `${process.env.REACT_APP_API_URL}/api/wallpapers`
  : 'http://localhost:5001/api/wallpapers';

// Replace the existing API_URL line
```

### 3. Create netlify.toml (in root directory)

```toml
[build]
  base = "client"
  command = "npm run build"
  publish = "build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"
```

---

## 🎨 Custom Domain (Optional)

### On Netlify
1. Go to Site settings → Domain management
2. Click "Add custom domain"
3. Follow DNS configuration instructions

### On Railway/Render
1. Go to Settings → Domains
2. Add your custom domain
3. Update DNS records

---

## 💰 Cost Breakdown

### Free Tier (Good for Testing)
- **Netlify**: Free (100GB bandwidth/month)
- **Railway**: Free tier (500 hours/month, $5 credit)
- **Render**: Free tier (750 hours/month)
- **Total**: $0/month

### Paid Tier (Production)
- **Netlify**: Free (sufficient for most sites)
- **Railway**: $5-10/month (after free tier)
- **Render**: $7/month (after free tier)
- **Total**: $5-10/month

---

## ⚡ Quick Deploy Commands

### 1. Prepare for Deployment
```bash
# Update backend CORS
# Update frontend API URL
# Create netlify.toml
```

### 2. Deploy Backend (Railway)
```bash
# Push to GitHub
git add .
git commit -m "Prepare for deployment"
git push origin main

# Deploy via Railway dashboard
```

### 3. Deploy Frontend (Netlify)
```bash
# Build locally to test
cd client
npm run build

# Deploy via Netlify dashboard or CLI
npm install -g netlify-cli
netlify deploy --prod
```

---

## 🔍 Testing Checklist

After deployment:
- [ ] Frontend loads correctly
- [ ] Search functionality works
- [ ] Categories load wallpapers
- [ ] Infinite scroll works
- [ ] Favorites persist
- [ ] Download works
- [ ] Preview modal works
- [ ] Mobile responsive
- [ ] No CORS errors in console

---

## 🐛 Common Issues

### Issue 1: CORS Error
**Problem**: Frontend can't connect to backend
**Solution**: Update CORS in server.js with your Netlify URL

### Issue 2: API URL Not Found
**Problem**: Frontend using localhost URL
**Solution**: Set REACT_APP_API_URL environment variable in Netlify

### Issue 3: Backend Timeout
**Problem**: Puppeteer takes too long
**Solution**: Railway/Render free tier may be slow, upgrade if needed

### Issue 4: Build Fails
**Problem**: npm install fails
**Solution**: Check Node version (use 18+)

---

## 📊 Performance Tips

1. **Enable Netlify CDN**: Automatic, no config needed
2. **Compress Images**: Already optimized
3. **Cache Backend**: Already implemented (1-hour TTL)
4. **Monitor Performance**: Use Netlify Analytics

---

## 🎉 You're Ready!

Follow the steps above and your WallpaperCave will be live in 15-20 minutes!

**Recommended Path**:
1. Deploy backend to Railway (5 min)
2. Update frontend API URL (2 min)
3. Deploy frontend to Netlify (5 min)
4. Test everything (5 min)

Good luck! 🚀
