import React, { useState } from 'react';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Container,
  AppBar,
  Toolbar,
  Typography,
  TextField,
  InputAdornment,
  Box,
  Card,
  CardMedia,
  IconButton,
  Dialog,
  CircularProgress,
  Fade,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Badge,
  Skeleton
} from '@mui/material';
import {
  Search,
  Download,
  Close,
  Wallpaper,
  Favorite,
  FavoriteBorder,
  Visibility,
  Home,
  Info,
  Policy,
  Menu as MenuIcon
} from '@mui/icons-material';
import Masonry from 'react-masonry-css';
import axios from 'axios';
import './App.css';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#2563eb',
    },
    background: {
      default: '#0a0e27',
      paper: '#111827',
    },
    text: {
      primary: '#f9fafb',
      secondary: '#9ca3af',
    },
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
});

const API_URL = process.env.REACT_APP_API_URL 
  ? `${process.env.REACT_APP_API_URL}/api/wallpapers`
  : 'http://localhost:5001/api/wallpapers';

const categories = [
  { name: 'Nature', image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop' },
  { name: 'Abstract', image: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=400&h=300&fit=crop' },
  { name: 'Space', image: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&h=300&fit=crop' },
  { name: 'City', image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=400&h=300&fit=crop' },
  { name: 'Ocean', image: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=400&h=300&fit=crop' },
  { name: 'Mountains', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop' },
  { name: 'Cars', image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&h=300&fit=crop' },
  { name: 'Gaming', image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=300&fit=crop' },
  { name: 'Anime', image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&h=300&fit=crop' },
  { name: 'Minimal', image: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=400&h=300&fit=crop' },
  { name: 'Dark', image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=300&fit=crop' },
  { name: 'Sunset', image: 'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=400&h=300&fit=crop' },
  { name: 'Forest', image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=400&h=300&fit=crop' },
  { name: 'Beach', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop' }
];

// Memoized WallpaperCard component for better performance
const WallpaperCard = React.memo(({ wallpaper, isFavorite, onToggleFavorite, onView, onDownload }) => {
  return (
    <Card
      elevation={0}
      sx={{
        mb: 2,
        bgcolor: '#111827',
        borderRadius: 2,
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        border: '1px solid transparent',
        '&:hover': {
          transform: 'translateY(-4px)',
          borderColor: '#2563eb',
          '& .overlay': { opacity: 1 }
        }
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          image={wallpaper.thumbnailUrl}
          alt={wallpaper.title}
          loading="lazy"
          decoding="async"
          sx={{ 
            display: 'block', 
            width: '100%',
            minHeight: 200,
            bgcolor: '#1f2937',
            willChange: 'transform',
            backfaceVisibility: 'hidden'
          }}
        />
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(wallpaper);
          }}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            bgcolor: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(10px)',
            color: isFavorite ? '#ef4444' : 'white',
            zIndex: 2,
            '&:hover': { 
              bgcolor: 'rgba(0,0,0,0.8)',
              transform: 'scale(1.1)'
            },
            transition: 'all 0.2s'
          }}
        >
          {isFavorite ? <Favorite /> : <FavoriteBorder />}
        </IconButton>
        <Box
          className="overlay"
          sx={{
            position: 'absolute',
            inset: 0,
            bgcolor: 'rgba(0,0,0,0.75)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
            opacity: 0,
            transition: 'opacity 0.2s',
            zIndex: 1
          }}
        >
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              onView(wallpaper);
            }}
            sx={{
              bgcolor: 'rgba(255,255,255,0.15)',
              color: 'white',
              backdropFilter: 'blur(10px)',
              '&:hover': { 
                bgcolor: 'rgba(255,255,255,0.25)',
                transform: 'scale(1.1)'
              },
              transition: 'all 0.2s'
            }}
          >
            <Visibility />
          </IconButton>
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              onDownload(wallpaper.imageUrl, wallpaper.id);
            }}
            sx={{
              bgcolor: '#2563eb',
              color: 'white',
              '&:hover': { 
                bgcolor: '#1d4ed8',
                transform: 'scale(1.1)'
              },
              transition: 'all 0.2s'
            }}
          >
            <Download />
          </IconButton>
        </Box>
      </Box>
    </Card>
  );
});

function App() {
  const [keyword, setKeyword] = useState('');
  const [wallpapers, setWallpapers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentKeyword, setCurrentKeyword] = useState('');
  const [offset, setOffset] = useState(0);
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [showFavorites, setShowFavorites] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);

  const loadWallpapers = async (searchKeyword, startOffset = 0, isLoadMore = false) => {
    try {
      // Set loading states
      if (isLoadMore) {
        if (loadingMore) {
          console.log('⏸️ Already loading more, skipping...');
          return;
        }
        setLoadingMore(true);
      } else {
        setLoading(true);
        setWallpapers([]);
        setCurrentKeyword(searchKeyword);
        setOffset(0);
      }
      
      // Update ref so loadMore always has the latest keyword
      currentKeywordRef.current = searchKeyword;

      const currentOffset = isLoadMore ? startOffset : 0;
      
      console.log(`📥 Loading: "${searchKeyword}" offset=${currentOffset}, isLoadMore=${isLoadMore}`);
      
      const response = await axios.get(API_URL, {
        params: { keyword: searchKeyword, limit: 20, offset: currentOffset },
        timeout: 15000
      });

      if (response.data.success) {
        const newWallpapers = response.data.data;
        
        console.log(`✅ Received ${newWallpapers.length} wallpapers for "${searchKeyword}"`);
        
        if (newWallpapers.length === 0) {
          console.log('⚠️ No wallpapers received');
          setLoading(false);
          setLoadingMore(false);
          return;
        }
        
        if (isLoadMore) {
          setWallpapers(prev => {
            const existingIds = new Set(prev.map(w => w.id));
            const uniqueNew = newWallpapers.filter(w => !existingIds.has(w.id));
            console.log(`➕ Adding ${uniqueNew.length} unique wallpapers (total will be: ${prev.length + uniqueNew.length})`);
            return [...prev, ...uniqueNew];
          });
          // Update offset AFTER setting wallpapers
          const newOffset = currentOffset + 20;
          console.log(`📍 Updating offset from ${currentOffset} to ${newOffset}`);
          setOffset(newOffset);
          setLoadingMore(false);
        } else {
          const seenIds = new Set();
          const uniqueWallpapers = newWallpapers.filter(w => {
            if (seenIds.has(w.id)) return false;
            seenIds.add(w.id);
            return true;
          });
          console.log(`🎨 Initial load: ${uniqueWallpapers.length} unique wallpapers`);
          setWallpapers(uniqueWallpapers);
          setOffset(20);
          setLoading(false);
        }
      } else {
        console.error('❌ API returned success: false');
        setLoading(false);
        setLoadingMore(false);
      }
    } catch (err) {
      console.error('❌ Error loading wallpapers:', err.message);
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      console.log(`🔍 Search initiated: "${keyword}"`);
      setShowFavorites(false);
      lastOffsetRef.current = 0; // Reset last offset
      currentKeywordRef.current = keyword; // Update keyword ref
      loadWallpapers(keyword, 0, false);
    }
  };

  const handleCategoryClick = (category) => {
    const searchKeyword = category + ' wallpaper';
    console.log(`📂 Category clicked: "${category}" → searching for "${searchKeyword}"`);
    setKeyword(searchKeyword);
    setShowFavorites(false);
    setCurrentPage('home');
    lastOffsetRef.current = 0; // Reset last offset
    currentKeywordRef.current = searchKeyword; // Update keyword ref
    loadWallpapers(searchKeyword, 0, false);
  };

  const handleHomeClick = () => {
    setShowFavorites(false);
    setCurrentPage('home');
    setMenuOpen(false);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setShowFavorites(false);
    setMenuOpen(false);
  };

  const displayWallpapers = React.useMemo(
    () => showFavorites ? favorites : wallpapers,
    [showFavorites, favorites, wallpapers]
  );

  const isFavorite = React.useCallback(
    (wallpaperId) => favorites.some(fav => fav.id === wallpaperId),
    [favorites]
  );

  const toggleFavorite = React.useCallback((wallpaper) => {
    setFavorites(prev => {
      const isFav = prev.some(fav => fav.id === wallpaper.id);
      const newFavorites = isFav
        ? prev.filter(fav => fav.id !== wallpaper.id)
        : [...prev, wallpaper];
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      return newFavorites;
    });
  }, []);

  const handleDownload = React.useCallback((url, id) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `wallpaper_${id}.jpg`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  const loadMoreRef = React.useRef(false);
  const lastOffsetRef = React.useRef(0);
  const currentKeywordRef = React.useRef('');
  
  const loadMore = () => {
    const currentOff = offset;
    const keyword = currentKeywordRef.current; // Use ref instead of state
    
    // Increased limit to 1000 for many more images (50 loads of 20 images)
    if (loadMoreRef.current || loadingMore || !keyword || currentOff >= 1000) {
      if (loadMoreRef.current) console.log(`⏸️ Load more skipped: already loading`);
      if (!keyword) console.log(`⏸️ Load more skipped: no keyword set`);
      if (currentOff >= 1000) console.log(`⏸️ Load more skipped: reached limit (${currentOff})`);
      return;
    }
    
    // Prevent calling with same offset twice
    if (lastOffsetRef.current === currentOff && currentOff > 0) {
      console.log(`⏸️ Same offset as last call: ${currentOff}, skipping...`);
      return;
    }
    
    loadMoreRef.current = true;
    lastOffsetRef.current = currentOff;
    console.log(`🔄 Load more triggered, current offset: ${currentOff}, keyword: "${keyword}"`);
    
    loadWallpapers(keyword, currentOff, true);
    
    setTimeout(() => {
      loadMoreRef.current = false;
    }, 2000);
  };

  React.useEffect(() => {
    const keywords = [
      'nature wallpaper', 'abstract wallpaper', 'space wallpaper', 
      'city wallpaper', 'ocean wallpaper', 'minimal wallpaper',
      'mountain wallpaper', 'sunset wallpaper', 'forest wallpaper',
      'dark wallpaper', 'anime wallpaper', 'gaming wallpaper'
    ];
    const randomKeyword = keywords[Math.floor(Math.random() * keywords.length)];
    console.log(`🎲 Random keyword selected: ${randomKeyword}`);
    loadWallpapers(randomKeyword, 0, false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Escape' && selectedImage) {
        setSelectedImage(null);
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedImage]);

  React.useEffect(() => {
    let scrollTimeout;
    const handleScroll = () => {
      if (showFavorites) return;
      
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const scrollTop = window.pageYOffset;
        const scrollHeight = document.documentElement.scrollHeight;
        const clientHeight = document.documentElement.clientHeight;
        const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;
        
        // Trigger at 70% - start loading before user reaches bottom
        if (scrollPercentage >= 0.7) {
          console.log(`📜 Scroll at ${Math.round(scrollPercentage * 100)}%`);
          loadMore();
        }
      }, 100);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      clearTimeout(scrollTimeout);
      window.removeEventListener('scroll', handleScroll);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showFavorites, loadingMore, currentKeyword, offset]);

  const breakpointColumns = React.useMemo(() => ({
    default: 4,
    1400: 4,
    1000: 3,
    600: 2
  }), []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      
      {/* Header */}
      <AppBar position="sticky" elevation={0} sx={{ bgcolor: '#111827', borderBottom: '1px solid #1f2937' }}>
        <Toolbar sx={{ py: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={handleHomeClick}>
            <Wallpaper sx={{ fontSize: 28, mr: 1.5, color: '#2563eb' }} />
            <Typography variant="h6" sx={{ fontWeight: 600, letterSpacing: '-0.5px' }}>
              WallpaperCave
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 'auto' }}>
            <Badge 
              badgeContent={favorites.length} 
              color="error"
              sx={{
                '& .MuiBadge-badge': {
                  bgcolor: '#ef4444',
                  color: 'white',
                  fontWeight: 600
                }
              }}
            >
              <IconButton
                onClick={() => {
                  setShowFavorites(!showFavorites);
                  setCurrentPage('home');
                }}
                sx={{
                  bgcolor: showFavorites ? '#2563eb' : 'transparent',
                  color: showFavorites ? 'white' : '#9ca3af',
                  '&:hover': { 
                    bgcolor: showFavorites ? '#1d4ed8' : 'rgba(37, 99, 235, 0.1)',
                    color: showFavorites ? 'white' : '#2563eb'
                  },
                  transition: 'all 0.2s'
                }}
              >
                <Favorite />
              </IconButton>
            </Badge>
            <IconButton
              onClick={() => setMenuOpen(true)}
              sx={{
                color: '#9ca3af',
                '&:hover': { 
                  bgcolor: 'rgba(37, 99, 235, 0.1)',
                  color: '#2563eb'
                },
                transition: 'all 0.2s'
              }}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Menu Drawer */}
      <Drawer
        anchor="right"
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        PaperProps={{
          sx: {
            bgcolor: '#111827',
            width: 280,
            borderLeft: '1px solid #1f2937'
          }
        }}
      >
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ color: '#f9fafb', fontWeight: 600 }}>
              Menu
            </Typography>
            <IconButton
              onClick={() => setMenuOpen(false)}
              sx={{
                color: '#9ca3af',
                '&:hover': { color: '#2563eb' }
              }}
            >
              <Close />
            </IconButton>
          </Box>
          
          <Divider sx={{ borderColor: '#1f2937', mb: 2 }} />
          
          <List>
            <ListItem
              onClick={handleHomeClick}
              sx={{
                borderRadius: 2,
                mb: 1,
                bgcolor: currentPage === 'home' ? 'rgba(37, 99, 235, 0.1)' : 'transparent',
                cursor: 'pointer',
                '&:hover': { bgcolor: 'rgba(37, 99, 235, 0.1)' }
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <Home sx={{ color: currentPage === 'home' ? '#2563eb' : '#9ca3af' }} />
              </ListItemIcon>
              <ListItemText 
                primary="Home" 
                sx={{ 
                  '& .MuiTypography-root': { 
                    color: currentPage === 'home' ? '#2563eb' : '#f9fafb',
                    fontWeight: currentPage === 'home' ? 600 : 400
                  } 
                }} 
              />
            </ListItem>
            
            <ListItem
              onClick={() => handlePageChange('about')}
              sx={{
                borderRadius: 2,
                mb: 1,
                bgcolor: currentPage === 'about' ? 'rgba(37, 99, 235, 0.1)' : 'transparent',
                cursor: 'pointer',
                '&:hover': { bgcolor: 'rgba(37, 99, 235, 0.1)' }
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <Info sx={{ color: currentPage === 'about' ? '#2563eb' : '#9ca3af' }} />
              </ListItemIcon>
              <ListItemText 
                primary="About" 
                sx={{ 
                  '& .MuiTypography-root': { 
                    color: currentPage === 'about' ? '#2563eb' : '#f9fafb',
                    fontWeight: currentPage === 'about' ? 600 : 400
                  } 
                }} 
              />
            </ListItem>
            
            <ListItem
              onClick={() => handlePageChange('privacy')}
              sx={{
                borderRadius: 2,
                bgcolor: currentPage === 'privacy' ? 'rgba(37, 99, 235, 0.1)' : 'transparent',
                cursor: 'pointer',
                '&:hover': { bgcolor: 'rgba(37, 99, 235, 0.1)' }
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <Policy sx={{ color: currentPage === 'privacy' ? '#2563eb' : '#9ca3af' }} />
              </ListItemIcon>
              <ListItemText 
                primary="Privacy Policy" 
                sx={{ 
                  '& .MuiTypography-root': { 
                    color: currentPage === 'privacy' ? '#2563eb' : '#f9fafb',
                    fontWeight: currentPage === 'privacy' ? 600 : 400
                  } 
                }} 
              />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      <Box sx={{ bgcolor: '#0a0e27', minHeight: 'calc(100vh - 73px)', display: 'flex', flexDirection: 'column' }}>
        <Container maxWidth="xl" sx={{ pt: 6, pb: 6, flex: 1 }}>
          
          {/* Home Page */}
          {currentPage === 'home' && !showFavorites && (
            <>
              {/* Search Section */}
              <Box sx={{ mb: 6 }}>
                <Typography variant="h4" sx={{ mb: 1, fontWeight: 700, color: '#f9fafb' }}>
                  Discover Wallpapers
                </Typography>
                <Typography variant="body1" sx={{ mb: 4, color: '#9ca3af' }}>
                  High quality wallpapers for your desktop
                </Typography>
            
            <form onSubmit={handleSearch}>
              <TextField
                fullWidth
                placeholder="Search wallpapers..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: '#6b7280' }} />
                    </InputAdornment>
                  ),
                  sx: {
                    bgcolor: '#111827',
                    borderRadius: 2,
                    fontSize: '1.1rem',
                    py: 0.5,
                    '& fieldset': { border: 'none' },
                    '&:hover': { bgcolor: '#1f2937' }
                  }
                }}
                sx={{ mb: 3 }}
              />
            </form>

            {/* Categories Slider */}
            <Box 
              sx={{ 
                position: 'relative',
                mx: -3,
                px: 3,
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: 80,
                  background: 'linear-gradient(to right, #0a0e27 0%, rgba(10, 14, 39, 0.8) 50%, transparent 100%)',
                  zIndex: 2,
                  pointerEvents: 'none'
                },
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  right: 0,
                  top: 0,
                  bottom: 0,
                  width: 80,
                  background: 'linear-gradient(to left, #0a0e27 0%, rgba(10, 14, 39, 0.8) 50%, transparent 100%)',
                  zIndex: 2,
                  pointerEvents: 'none'
                }
              }}
            >
              <Box 
                sx={{ 
                  display: 'flex', 
                  gap: 1.5,
                  overflowX: 'auto',
                  overflowY: 'hidden',
                  scrollBehavior: 'smooth',
                  pb: 2,
                  cursor: 'grab',
                  userSelect: 'none',
                  '&:active': {
                    cursor: 'grabbing'
                  },
                  // Hide scrollbar
                  scrollbarWidth: 'none', // Firefox
                  msOverflowStyle: 'none', // IE/Edge
                  '&::-webkit-scrollbar': {
                    display: 'none' // Chrome/Safari
                  }
                }}
              >
                {categories.map((cat) => (
                  <Box
                    key={cat.name}
                    onClick={() => handleCategoryClick(cat.name)}
                    sx={{
                      position: 'relative',
                      minWidth: 140,
                      width: 140,
                      height: 80,
                      borderRadius: 2,
                      overflow: 'hidden',
                      cursor: 'pointer',
                      border: '2px solid transparent',
                      transition: 'all 0.2s',
                      flexShrink: 0,
                      '&:hover': {
                        borderColor: '#2563eb',
                        transform: 'translateY(-4px)',
                        '& .overlay': { opacity: 0.4 }
                      }
                    }}
                  >
                    <Box
                      component="img"
                      src={cat.image}
                      alt={cat.name}
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                    <Box
                      className="overlay"
                      sx={{
                        position: 'absolute',
                        inset: 0,
                        bgcolor: 'rgba(0,0,0,0.6)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'opacity 0.2s'
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'white',
                          fontWeight: 600,
                          textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                        }}
                      >
                        {cat.name}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
          </>
          )}

          {/* Loading - Skeleton */}
          {loading && currentPage === 'home' && (
            <Box>
              <Masonry
                breakpointCols={breakpointColumns}
                className="masonry-grid"
                columnClassName="masonry-grid-column"
              >
                {[...Array(20)].map((_, index) => (
                  <Card
                    key={`skeleton-initial-${index}`}
                    elevation={0}
                    sx={{
                      mb: 2,
                      bgcolor: '#111827',
                      borderRadius: 2,
                      overflow: 'hidden',
                      border: '1px solid #1f2937'
                    }}
                  >
                    <Skeleton 
                      variant="rectangular" 
                      sx={{ 
                        bgcolor: '#1f2937',
                        height: Math.random() * 200 + 250
                      }} 
                      animation="wave"
                    />
                  </Card>
                ))}
              </Masonry>
            </Box>
          )}

          {/* Empty State */}
          {!loading && displayWallpapers.length === 0 && currentPage === 'home' && (
            <Box sx={{ textAlign: 'center', py: 12 }}>
              {showFavorites ? (
                <>
                  <Favorite sx={{ fontSize: 80, color: '#374151', mb: 2 }} />
                  <Typography variant="h6" sx={{ color: '#9ca3af', mb: 1 }}>
                    No favorites yet
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#6b7280' }}>
                    Click the heart icon on wallpapers to save them
                  </Typography>
                </>
              ) : (
                <>
                  <Wallpaper sx={{ fontSize: 80, color: '#374151', mb: 2 }} />
                  <Typography variant="h6" sx={{ color: '#9ca3af', mb: 1 }}>
                    No wallpapers found
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#6b7280' }}>
                    Try a different search term
                  </Typography>
                </>
              )}
            </Box>
          )}

          {/* Gallery */}
          {!loading && displayWallpapers.length > 0 && currentPage === 'home' && (
            <Fade in timeout={300}>
              <Box>
                {showFavorites && (
                  <Typography variant="h6" sx={{ mb: 3, color: '#f9fafb', fontWeight: 600 }}>
                    My Favorites ({favorites.length})
                  </Typography>
                )}

                <Masonry
                  breakpointCols={breakpointColumns}
                  className="masonry-grid"
                  columnClassName="masonry-grid-column"
                >
                  {displayWallpapers.map((wallpaper) => (
                    <WallpaperCard
                      key={wallpaper.id}
                      wallpaper={wallpaper}
                      isFavorite={isFavorite(wallpaper.id)}
                      onToggleFavorite={toggleFavorite}
                      onView={setSelectedImage}
                      onDownload={handleDownload}
                    />
                  ))}
                </Masonry>

                {/* Skeleton Loading for Load More */}
                {loadingMore && !showFavorites && (
                  <Box sx={{ mt: 2 }}>
                    <Masonry
                      breakpointCols={breakpointColumns}
                      className="masonry-grid"
                      columnClassName="masonry-grid-column"
                    >
                      {[...Array(8)].map((_, index) => (
                        <Card
                          key={`skeleton-${index}`}
                          elevation={0}
                          sx={{
                            mb: 2,
                            bgcolor: '#111827',
                            borderRadius: 2,
                            overflow: 'hidden',
                            border: '1px solid #1f2937'
                          }}
                        >
                          <Skeleton 
                            variant="rectangular" 
                            sx={{ 
                              bgcolor: '#1f2937',
                              height: Math.random() * 150 + 200
                            }} 
                            animation="wave"
                          />
                        </Card>
                      ))}
                    </Masonry>
                  </Box>
                )}
              </Box>
            </Fade>
          )}

          {/* About Page */}
          {currentPage === 'about' && (
            <Box sx={{ maxWidth: 800, mx: 'auto', py: 4 }}>
              <Typography variant="h4" sx={{ mb: 4, fontWeight: 700, color: '#f9fafb' }}>
                About WallpaperCave
              </Typography>
              <Box sx={{ bgcolor: '#111827', borderRadius: 2, p: 4, border: '1px solid #1f2937' }}>
                <Typography variant="body1" sx={{ mb: 3, color: '#e5e7eb', lineHeight: 1.8, fontSize: '1.1rem' }}>
                  WallpaperCave is your destination for discovering and downloading high-quality wallpapers for your desktop and mobile devices.
                </Typography>
                <Typography variant="body1" sx={{ mb: 3, color: '#e5e7eb', lineHeight: 1.8, fontSize: '1.1rem' }}>
                  We curate the best wallpapers from around the web, making it easy for you to find the perfect background for your screen.
                </Typography>
                <Typography variant="body1" sx={{ mb: 3, color: '#e5e7eb', lineHeight: 1.8, fontSize: '1.1rem' }}>
                  Browse by category, save your favorites, and download in high resolution - all for free.
                </Typography>
                
                <Box sx={{ mt: 4, pt: 4, borderTop: '1px solid #1f2937' }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#2563eb' }}>
                    Features
                  </Typography>
                  <Box component="ul" sx={{ color: '#e5e7eb', pl: 3 }}>
                    <li style={{ marginBottom: '12px', lineHeight: 1.8 }}>Browse thousands of high-quality wallpapers</li>
                    <li style={{ marginBottom: '12px', lineHeight: 1.8 }}>Organized by categories for easy discovery</li>
                    <li style={{ marginBottom: '12px', lineHeight: 1.8 }}>Save your favorites for quick access</li>
                    <li style={{ marginBottom: '12px', lineHeight: 1.8 }}>Download in original high resolution</li>
                    <li style={{ marginBottom: '12px', lineHeight: 1.8 }}>No registration required</li>
                  </Box>
                </Box>
              </Box>
            </Box>
          )}

          {/* Privacy Policy Page */}
          {currentPage === 'privacy' && (
            <Box sx={{ maxWidth: 800, mx: 'auto', py: 4 }}>
              <Typography variant="h4" sx={{ mb: 4, fontWeight: 700, color: '#f9fafb' }}>
                Privacy Policy
              </Typography>
              <Box sx={{ bgcolor: '#111827', borderRadius: 2, p: 4, border: '1px solid #1f2937' }}>
                <Typography variant="body2" sx={{ mb: 4, color: '#9ca3af' }}>
                  Last updated: March 31, 2026
                </Typography>
                
                <Typography variant="body1" sx={{ mb: 4, color: '#e5e7eb', lineHeight: 1.8 }}>
                  Your privacy is important to us. This privacy policy explains how we handle your information when you use WallpaperCave.
                </Typography>
                
                <Typography variant="h6" sx={{ mt: 4, mb: 2, fontWeight: 600, color: '#2563eb' }}>
                  Information We Collect
                </Typography>
                <Typography variant="body1" sx={{ mb: 3, color: '#e5e7eb', lineHeight: 1.8 }}>
                  We store your favorite wallpapers locally in your browser using localStorage. This data never leaves your device and is only accessible to you.
                </Typography>
                
                <Typography variant="h6" sx={{ mt: 4, mb: 2, fontWeight: 600, color: '#2563eb' }}>
                  Cookies and Tracking
                </Typography>
                <Typography variant="body1" sx={{ mb: 3, color: '#e5e7eb', lineHeight: 1.8 }}>
                  We do not use cookies or any tracking technologies. We do not collect any personal information or analytics data.
                </Typography>
                
                <Typography variant="h6" sx={{ mt: 4, mb: 2, fontWeight: 600, color: '#2563eb' }}>
                  Third-Party Content
                </Typography>
                <Typography variant="body1" sx={{ mb: 3, color: '#e5e7eb', lineHeight: 1.8 }}>
                  Wallpapers are sourced from publicly available sources. We respect copyright and intellectual property rights. If you believe any content infringes on your rights, please contact us and we will remove it promptly.
                </Typography>
                
                <Typography variant="h6" sx={{ mt: 4, mb: 2, fontWeight: 600, color: '#2563eb' }}>
                  Data Security
                </Typography>
                <Typography variant="body1" sx={{ mb: 3, color: '#e5e7eb', lineHeight: 1.8 }}>
                  Since all data is stored locally on your device, you have complete control over your information. Clearing your browser data will remove all saved favorites.
                </Typography>
                
                <Typography variant="h6" sx={{ mt: 4, mb: 2, fontWeight: 600, color: '#2563eb' }}>
                  Changes to This Policy
                </Typography>
                <Typography variant="body1" sx={{ color: '#e5e7eb', lineHeight: 1.8 }}>
                  We may update this privacy policy from time to time. Any changes will be posted on this page with an updated revision date.
                </Typography>
              </Box>
            </Box>
          )}
        </Container>

        {/* Footer */}
        <Box sx={{ bgcolor: '#111827', borderTop: '1px solid #1f2937', py: 4, mt: 'auto' }}>
          <Container maxWidth="xl">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
              <Typography variant="body2" sx={{ color: '#9ca3af' }}>
                © 2026 WallpaperCave. All rights reserved.
              </Typography>
              <Box sx={{ display: 'flex', gap: 3 }}>
                <Typography
                  variant="body2"
                  onClick={() => handlePageChange('about')}
                  sx={{
                    color: '#9ca3af',
                    cursor: 'pointer',
                    '&:hover': { color: '#2563eb' },
                    transition: 'color 0.2s'
                  }}
                >
                  About
                </Typography>
                <Typography
                  variant="body2"
                  onClick={() => handlePageChange('privacy')}
                  sx={{
                    color: '#9ca3af',
                    cursor: 'pointer',
                    '&:hover': { color: '#2563eb' },
                    transition: 'color 0.2s'
                  }}
                >
                  Privacy Policy
                </Typography>
              </Box>
            </Box>
          </Container>
        </Box>
      </Box>

      {/* Preview Modal */}
      <Dialog
        open={Boolean(selectedImage)}
        onClose={() => setSelectedImage(null)}
        maxWidth={false}
        PaperProps={{
          sx: {
            bgcolor: 'transparent',
            boxShadow: 'none',
            maxWidth: '90vw',
            maxHeight: '90vh',
            m: 0
          }
        }}
        sx={{ '& .MuiBackdrop-root': { bgcolor: 'rgba(0,0,0,0.95)' } }}
      >
        {selectedImage && (
          <Box sx={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <IconButton
              onClick={() => setSelectedImage(null)}
              sx={{
                position: 'absolute',
                top: -60,
                right: 0,
                bgcolor: 'rgba(255,255,255,0.1)',
                color: 'white',
                backdropFilter: 'blur(10px)',
                '&:hover': { 
                  bgcolor: 'rgba(255,255,255,0.2)',
                  transform: 'scale(1.1)'
                },
                transition: 'all 0.2s',
                zIndex: 10
              }}
            >
              <Close />
            </IconButton>
            <Box
              component="img"
              src={selectedImage.imageUrl}
              alt={selectedImage.title}
              sx={{
                maxWidth: '100%',
                maxHeight: '75vh',
                borderRadius: 2,
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
                objectFit: 'contain'
              }}
            />
            <Box
              sx={{
                mt: 2,
                bgcolor: 'rgba(0,0,0,0.85)',
                backdropFilter: 'blur(20px)',
                p: 2.5,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderRadius: 2,
                width: '100%',
                maxWidth: '600px'
              }}
            >
              <Typography 
                sx={{ 
                  color: 'white', 
                  fontWeight: 500,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  flex: 1,
                  mr: 2
                }}
              >
                {selectedImage.title}
              </Typography>
              <IconButton
                onClick={() => handleDownload(selectedImage.imageUrl, selectedImage.id)}
                sx={{
                  bgcolor: '#2563eb',
                  color: 'white',
                  px: 3,
                  borderRadius: 2,
                  flexShrink: 0,
                  '&:hover': { 
                    bgcolor: '#1d4ed8',
                    transform: 'scale(1.05)'
                  },
                  transition: 'all 0.2s'
                }}
              >
                <Download sx={{ mr: 1 }} />
                <Typography variant="button" sx={{ fontWeight: 600 }}>
                  Download HD
                </Typography>
              </IconButton>
            </Box>
          </Box>
        )}
      </Dialog>
    </ThemeProvider>
  );
}

export default App;
