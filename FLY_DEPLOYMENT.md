# 🚀 Deploy to Fly.io

## What is Fly.io?
Fly.io is a platform that runs your app close to users worldwide. It's perfect for Node.js apps with Puppeteer.

## ✅ Prerequisites
- Fly.io account (free tier available)
- Fly CLI installed on your computer

---

## Step 1: Install Fly CLI

### macOS:
```bash
brew install flyctl
```

### Linux:
```bash
curl -L https://fly.io/install.sh | sh
```

### Windows:
```powershell
iwr https://fly.io/install.ps1 -useb | iex
```

---

## Step 2: Login to Fly.io

```bash
fly auth login
```

This will open your browser to login.

---

## Step 3: Deploy Your App

From your project directory:

```bash
# Launch the app (first time)
fly launch

# When prompted:
# - App name: wallpapercave (or your choice)
# - Region: Choose closest to you
# - PostgreSQL: No
# - Redis: No
# - Deploy now: Yes
```

Fly.io will:
1. Detect the Dockerfile
2. Build your app
3. Deploy it
4. Give you a URL like: `https://wallpapercave.fly.dev`

---

## Step 4: Update Netlify Environment Variable

1. **Go to Netlify Dashboard**
   - Visit: https://app.netlify.com
   - Select your WallpaperCave site

2. **Update Environment Variable**
   - Go to: Site configuration → Environment variables
   - Find: `REACT_APP_API_URL`
   - Update value to: `https://your-app-name.fly.dev` (your Fly.io URL)
   - Click "Save"

3. **Redeploy Netlify**
   - Go to: Deploys
   - Click "Trigger deploy" → "Clear cache and deploy site"

---

## Step 5: Update CORS in server.js

The CORS is already configured for your Netlify URL (`wallpapesrcave.netlify.app`), so you're good to go!

---

## 🔄 Future Deployments

After making changes:

```bash
# Commit your changes
git add .
git commit -m "Your changes"
git push

# Deploy to Fly.io
fly deploy
```

---

## 📊 Monitor Your App

```bash
# Check app status
fly status

# View logs
fly logs

# Open app in browser
fly open

# Check health
fly checks list
```

---

## 💰 Pricing

Fly.io Free Tier includes:
- Up to 3 shared-cpu-1x 256mb VMs
- 160GB outbound data transfer
- Perfect for this project!

---

## 🐛 Troubleshooting

### App won't start?
```bash
fly logs
```
Look for errors in the logs.

### Out of memory?
Edit `fly.toml` and increase memory:
```toml
[[vm]]
  memory_mb = 1024
```
Then: `fly deploy`

### Puppeteer issues?
The Dockerfile includes all Chromium dependencies. If issues persist:
```bash
fly ssh console
chromium --version
```

---

## ✅ Test Your Deployment

1. **Test health endpoint:**
   ```bash
   curl https://your-app-name.fly.dev/api/health
   ```

2. **Test wallpapers endpoint:**
   ```bash
   curl "https://your-app-name.fly.dev/api/wallpapers?keyword=nature&limit=5"
   ```

3. **Visit your Netlify site** - wallpapers should load!

---

## 🎯 Quick Commands

```bash
# Deploy
fly deploy

# View logs
fly logs

# Restart app
fly apps restart wallpapercave

# Scale memory
fly scale memory 512

# SSH into app
fly ssh console
```

---

**Your app will be live at: `https://your-app-name.fly.dev`** 🎉
