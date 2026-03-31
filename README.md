# 🖼️ WallpaperCave

A modern, high-performance wallpaper discovery and download platform built with React and Node.js.

![WallpaperCave](https://img.shields.io/badge/version-2.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

- 🎨 **Browse thousands of wallpapers** across 14+ categories
- 🔍 **Smart search** with real-time results
- ♾️ **Infinite scroll** for seamless browsing
- ❤️ **Favorites system** with localStorage persistence
- 📱 **Fully responsive** design (desktop, tablet, mobile)
- ⚡ **Lightning fast** with caching and optimization
- 🎭 **Skeleton loading** for smooth UX
- 🖼️ **Preview modal** with full-screen view
- ⬇️ **One-click download** in high resolution
- 🌙 **Dark theme** with professional design

## 🎯 Categories

Nature • Abstract • Space • City • Ocean • Mountains • Cars • Gaming • Anime • Minimal • Dark • Sunset • Forest • Beach

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd wallpapercave
```

2. **Install all dependencies**
```bash
npm run install-all
```

3. **Start development servers**
```bash
npm run dev
```

This will start:
- Backend API on http://localhost:5001
- Frontend on http://localhost:3000

### Available Scripts

```bash
npm run server      # Start backend only
npm run client      # Start frontend only
npm run dev         # Start both (recommended)
npm run build       # Build for production
npm run install-all # Install all dependencies
```

## 🏗️ Tech Stack

### Frontend
- **React 19** - UI framework
- **Material-UI** - Component library
- **Axios** - HTTP client
- **React Masonry CSS** - Grid layout

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **Puppeteer** - Web scraping
- **CORS** - Cross-origin support

## 📁 Project Structure

```
wallpapercave/
├── client/                 # React frontend
│   ├── public/            # Static files
│   │   ├── index.html     # HTML template (SEO optimized)
│   │   ├── robots.txt     # Search engine rules
│   │   └── sitemap.xml    # Site structure
│   ├── src/
│   │   ├── App.js         # Main component
│   │   ├── App.css        # Styles
│   │   └── index.js       # Entry point
│   └── package.json
├── server.js              # Backend API
├── package.json           # Root dependencies
├── DEPLOYMENT.md          # Deployment guide
└── README.md             # This file
```

## 🎨 Design Features

- **Color Scheme**: Dark (#0a0e27, #111827) with Blue (#2563eb) accents
- **Typography**: System fonts for optimal performance
- **Layout**: 4-column masonry grid (responsive)
- **Animations**: Smooth transitions and hover effects
- **Loading States**: Skeleton screens for better UX

## ⚡ Performance

- **Backend Caching**: 1-hour TTL for API responses
- **React Optimization**: memo, useMemo, useCallback
- **Image Loading**: Lazy loading with async decoding
- **Infinite Scroll**: Debounced with smart triggering
- **Bundle Size**: Optimized with code splitting

## 🔒 Privacy

- No user tracking or analytics (by default)
- Favorites stored locally in browser
- No personal data collection
- No cookies or external tracking

## 📱 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🚀 Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions including:
- VPS deployment (DigitalOcean, AWS)
- Docker deployment
- Vercel + Railway/Render
- Environment configuration
- SSL setup
- Monitoring

## 📊 SEO Optimization

✅ Meta tags (description, keywords, author)
✅ Open Graph tags for social sharing
✅ Twitter Card tags
✅ Canonical URLs
✅ robots.txt and sitemap.xml
✅ Semantic HTML structure
✅ Mobile-friendly design

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Wallpaper sources from Pinterest
- Icons from Material-UI
- Built with React and Node.js

## 📞 Support

For issues or questions, please open an issue on GitHub.

---

Made with ❤️ by WallpaperCave Team
