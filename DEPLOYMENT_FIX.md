# 🚨 Fix: Wallpapers Not Loading on Netlify

## Problem
Your frontend is deployed on Netlify, but wallpapers aren't loading because:
- ❌ Backend API is NOT deployed yet
- ❌ Frontend is trying to connect to `http://localhost:5001` (only works locally)
- ✅ Frontend is deployed on Netlify

## Solution: Deploy Backend First!

---

## 🚀 Quick Fix (15 minutes)

### Step 1: Deploy Backend to Railway

1. **Go to Railway**
   - Visit: https://railway.app
   - Sign up/Login with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose: `Medfakhir/WallpaperCave`
   - Railway will auto-detect Node.js

3. **Wait for Deployment** (2-3 minutes)
   - Railway will automatically:
     - Install dependencies
     - Start `node server.js`
     - Give you a URL

4. **Copy Your Backend URL**
   - Example: `https://wallpapercave-production.up.railway.app`
   - Copy this URL!

---

### Step 2: Update Frontend Environment Variable

1. **Go to Netlify Dashboard**
   - Visit: https://app.netlify.com
   - Select your WallpaperCave site

2. **Add Environment Variable**
   - Go to: Site settings → Environment variables
   - Click "Add a variable"
   - Key: `REACT_APP_API_URL`
   - Value: `https://your-backend-url.railway.app` (paste your Railway URL)
   - Click "Save"

3. **Trigger Redeploy**
   - Go to: Deploys
   - Click "Trigger deploy" → "Clear cache and deploy site"
   - Wait 2-3 minutes

---

### Step 3: Update CORS in Backend

1. **Update server.js on GitHub**

Edit the `allowedOrigins` array in `server.js`:

```javascript
const allowedOrigins = [
  'http://localhost:3000',
  'https://your-site.netlify.app',  // Add your Netlify URL here
  'https://wallpapercave.netlify.app',
  process.env.CLIENT_URL
].filter(Boolean);
```

2. **Push to GitHub**
```bash
git add server.js
git commit -m "Update CORS for Netlify"
git push
```

3. **Railway will auto-redeploy** (1-2 minutes)

---

## ✅ Test Your Site

After all steps:
1. Visit your Netlify URL
2. Wallpapers should load!
3. Search should work
4. Categories should work
5. Infinite scroll should work

---

## 🐛 Still Not Working?

### Check Backend is Running

Visit: `https://your-backend-url.railway.app/api/health`

**Should see:**
```json
{
  "status": "ok",
  "timestamp": "2026-03-31T...",
  "uptime": 123.45,
  "environment": "production"
}
```

### Check Frontend Console

1. Open your Netlify site
2. Press F12 (Developer Tools)
3. Go to Console tab
4. Look for errors

**Common errors:**
- `ERR_CONNECTION_REFUSED` → Backend not deployed
- `CORS error` → Need to update allowedOrigins
- `404 Not Found` → Wrong API URL

---

## 💰 Cost

Both are FREE:
- Railway: Free tier (500 hours/month)
- Netlify: Free tier (100GB bandwidth/month)

---

## 📝 Summary

**What you need to do:**
1. ✅ Deploy backend to Railway (5 min)
2. ✅ Add REACT_APP_API_URL to Netlify (2 min)
3. ✅ Update CORS in server.js (2 min)
4. ✅ Test your site (1 min)

**Total time: 10 minutes**

---

## 🎯 Alternative: Use Render Instead of Railway

If Railway doesn't work, use Render:

1. Go to https://render.com
2. Click "New +" → "Web Service"
3. Connect GitHub repo
4. Settings:
   - Name: `wallpapercave-api`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `node server.js`
5. Deploy!

Then follow Step 2 and 3 above with your Render URL.

---

**Your site will work after deploying the backend! 🚀**
