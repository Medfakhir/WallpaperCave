# 🚂 Railway Deployment Guide

## ✅ Fixed! Ready to Deploy

I've fixed the Railway deployment issues:
- ✅ Removed `build` script (was trying to build React app)
- ✅ Added `nixpacks.toml` configuration
- ✅ Configured for backend-only deployment

---

## 🚀 Deploy to Railway (5 Minutes)

### Step 1: Create Railway Project

1. **Go to Railway**: https://railway.app
2. **Sign up/Login** with GitHub
3. Click **"New Project"**
4. Select **"Deploy from GitHub repo"**
5. Choose **"Medfakhir/WallpaperCave"**

### Step 2: Wait for Deployment

Railway will automatically:
- ✅ Detect Node.js
- ✅ Install Chromium (for Puppeteer)
- ✅ Install dependencies
- ✅ Start server with `node server.js`

**Wait 3-5 minutes** for first deployment.

### Step 3: Get Your Backend URL

1. Click on your deployment
2. Go to **"Settings"** tab
3. Scroll to **"Domains"**
4. Click **"Generate Domain"**
5. Copy your URL (e.g., `https://wallpapercave-production.up.railway.app`)

### Step 4: Test Backend

Visit: `https://your-url.railway.app/api/health`

**Should see:**
```json
{
  "status": "ok",
  "timestamp": "2026-03-31T12:00:00.000Z",
  "uptime": 123.45,
  "environment": "production"
}
```

✅ **Backend is working!**

---

## 🌐 Configure Netlify

### Step 1: Add Environment Variable

1. Go to **Netlify Dashboard**
2. Select your **WallpaperCave** site
3. Go to **Site settings** → **Environment variables**
4. Click **"Add a variable"**
   - **Key**: `REACT_APP_API_URL`
   - **Value**: `https://your-url.railway.app` (your Railway URL)
5. Click **"Save"**

### Step 2: Redeploy Netlify

1. Go to **Deploys** tab
2. Click **"Trigger deploy"**
3. Select **"Clear cache and deploy site"**
4. Wait 2-3 minutes

---

## 🔒 Update CORS

### Get Your Netlify URL

Example: `https://amazing-site-123.netlify.app`

### Edit server.js

Find line ~13 and update:

```javascript
const allowedOrigins = [
  'http://localhost:3000',
  'https://amazing-site-123.netlify.app',  // ← Add your Netlify URL here
  'https://wallpapercave.netlify.app',
  process.env.CLIENT_URL
].filter(Boolean);
```

### Push to GitHub

```bash
git add server.js
git commit -m "Add Netlify URL to CORS"
git push
```

Railway will auto-redeploy in 1-2 minutes.

---

## ✅ Test Your Live Site!

1. Visit your Netlify URL
2. Wallpapers should load! 🎉
3. Try searching
4. Try categories
5. Try infinite scroll

---

## 🐛 Troubleshooting

### Backend Not Starting

**Check Railway Logs:**
1. Go to Railway dashboard
2. Click your project
3. Go to **"Deployments"** tab
4. Click latest deployment
5. Check logs for errors

**Common Issues:**
- Puppeteer installation failed → Railway should auto-install Chromium
- Port binding error → Railway auto-assigns port
- Out of memory → Upgrade Railway plan

### Frontend Can't Connect

**Check Browser Console:**
1. Open your Netlify site
2. Press F12
3. Go to Console tab
4. Look for errors

**Common Errors:**
- `ERR_CONNECTION_REFUSED` → Backend not running
- `CORS error` → Need to add Netlify URL to allowedOrigins
- `404` → Wrong REACT_APP_API_URL

### Wallpapers Not Loading

**Check:**
1. Backend health: `https://your-url.railway.app/api/health`
2. Test API: `https://your-url.railway.app/api/wallpapers?keyword=nature&limit=5`
3. Check Netlify environment variables
4. Check CORS configuration

---

## 💰 Railway Pricing

**Free Tier:**
- $5 credit per month
- ~500 hours of usage
- Perfect for this project!

**If you run out:**
- Upgrade to Hobby plan ($5/month)
- Or use Render.com (also has free tier)

---

## 📊 Monitor Your Deployment

### Railway Dashboard

- **Deployments**: See deployment history
- **Metrics**: CPU, Memory, Network usage
- **Logs**: Real-time server logs
- **Settings**: Environment variables, domains

### Useful Commands

**View logs:**
- Go to Railway dashboard → Deployments → Click deployment → View logs

**Restart service:**
- Go to Railway dashboard → Click project → Click "Restart"

**Redeploy:**
- Push to GitHub → Railway auto-deploys

---

## 🎯 Alternative: Use Render

If Railway doesn't work, try Render:

1. Go to https://render.com
2. Click **"New +"** → **"Web Service"**
3. Connect GitHub repo
4. Settings:
   - **Name**: `wallpapercave-api`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
5. Click **"Create Web Service"**

Then follow the same Netlify configuration steps.

---

## ✅ Summary

**What you did:**
1. ✅ Deployed backend to Railway
2. ✅ Got backend URL
3. ✅ Added REACT_APP_API_URL to Netlify
4. ✅ Updated CORS in server.js
5. ✅ Tested live site

**Your site is now fully deployed! 🚀**

---

## 📞 Need Help?

**Railway Support:**
- Discord: https://discord.gg/railway
- Docs: https://docs.railway.app

**Check Files:**
- DEPLOYMENT_FIX.md - General deployment guide
- NETLIFY_DEPLOYMENT.md - Detailed Netlify guide
- QUICK_DEPLOY.md - Quick start guide

---

**Railway should now deploy successfully! Check your dashboard in 3-5 minutes.** 🎉
