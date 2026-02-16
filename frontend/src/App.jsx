import { useState, useEffect } from 'react' // ✅ Added useEffect
import { Routes, Route, useNavigate, Navigate, useLocation } from 'react-router-dom'
import { getTrendingMovies } from './services/tmdb' // ✅ Import the API service
import Navbar from './components/Navbar'
import Landing from './components/Landing'
import MovieCard from './components/MovieCard'
import SignIn from './components/SignIn'
import SignUp from './components/SignUp'
import Watchlist from './components/Watchlist'
import Collections from './components/Collections'
import CollectionDetail from './components/CollectionDetail'
import MovieDetail from './components/MovieDetail'
import SearchResults from './components/SearchResults'
import Favorites from './components/Favorites'
import Profile from './components/Profile'
import Settings from './components/Settings'
import UserWelcomeBar from './components/UserWelcomeBar'
import './App.css'
import './components/SharedStyles.css'

// ❌ DELETED: const mockMovies = [...] (We don't need this anymore!)

import SkeletonCard from './components/SkeletonCard'

// 1️⃣ The Dashboard Component (Updated to handle loading)
const Dashboard = ({ movies, username, watchlistCount, favoritesCount, historyCount, onLogout }) => {
  // ✅ Loading Check: If data hasn't arrived yet, show skeleton grid
  if (!movies || movies.length === 0) {
    return (
      <div className="dashboard-container">
        <UserWelcomeBar 
          username={username} 
          watchlistCount={watchlistCount}
          favoritesCount={favoritesCount}
          historyCount={historyCount}
          onLogout={onLogout}
        />
        <section className="section trending-section">
          <div className="section-header">
            <h2 className="section-title">Trending</h2>
            <div className="skeleton" style={{ width: '300px', height: '1.2em', marginTop: '0.5rem' }}></div>
          </div>
          <div className="movie-grid">
            {[...Array(8)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <UserWelcomeBar 
        username={username} 
        watchlistCount={watchlistCount}
        favoritesCount={favoritesCount}
        historyCount={historyCount}
        onLogout={onLogout}
      />
      
      {/* Trending Section */}
      <section className="section trending-section">
        <div className="section-header">
          <h2 className="section-title">Trending</h2>
          <p className="section-subtitle">Discover the most popular movies everyone is talking about.</p>
        </div>
        <div className="movie-grid">
          {/* Show top 12 movies from API */}
          {movies.slice(0, 12).map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </section>

      {/* Staff Picks Section (KEPT - Using API data now) */}
      <section className="section staff-picks-section">
        <div className="section-header">
          <h2 className="section-title">Staff Picks</h2>
          <p className="section-subtitle">Curated selection of must-watch films handpicked for you.</p>
        </div>
        <div className="picks-grid">
           {/* We take movies 4, 5, and 6 for "Staff Picks" just to show something different */}
           {movies.slice(4, 7).map((movie) => (
             <MovieCard key={movie.id} movie={movie} />
           ))}
        </div>
      </section>
    </div>
  )
};

// 2️⃣ The Main App Component
function App() {
  // ✅ STATE CHANGE: Start with empty array, not mock data
  const [movies, setMovies] = useState([]) 
  const [favorites, setFavorites] = useState(() => {
    try { return JSON.parse(localStorage.getItem('kino_favorites') || '[]') } catch { return [] }
  })
  const [watchlist, setWatchlist] = useState(() => {
    try { return JSON.parse(localStorage.getItem('kino_watchlist') || '[]') } catch { return [] }
  })
  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem('kino_history') || '[]') } catch { return [] }
  })
  
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('kino_isLoggedIn') === 'true'
  })
  
  const [username, setUsername] = useState(() => {
    return localStorage.getItem('kino_username') || 'Movie Buff'
  })

  // ✅ NEW: Email State
  const [email, setEmail] = useState(() => {
    return localStorage.getItem('kino_email') || ''
  })

  const navigate = useNavigate();
  const location = useLocation();

  // ✅ NEW: Fetch Data from TMDB when App loads
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        console.log("Fetching movies...");
        const trendingMovies = await getTrendingMovies();
        setMovies(trendingMovies);
        console.log("Movies loaded:", trendingMovies);
      } catch (error) {
        console.error("Error loading movies:", error);
      }
    };

    fetchMovies();
  }, []); // Run once on mount
  
  useEffect(() => {
    localStorage.setItem('kino_favorites', JSON.stringify(favorites))
  }, [favorites])
  
  useEffect(() => {
    localStorage.setItem('kino_watchlist', JSON.stringify(watchlist))
  }, [watchlist])
  
  useEffect(() => {
    localStorage.setItem('kino_history', JSON.stringify(history))
  }, [history])

  const isFav = (id) => favorites.some(m => m.id === id)
  const isInWatchlist = (id) => watchlist.some(m => m.id === id)
  const isInHistory = (id) => history.some(m => m.id === id)
  
  const upsertMinimal = (m) => ({
    id: m.id,
    title: m.title,
    poster_path: m.poster_path || m.posterUrl || null,
    backdrop_path: m.backdrop_path || null,
    release_date: m.release_date || null,
    vote_average: m.vote_average ?? m.rating ?? null,
    overview: m.overview || m.description || ''
  })
  
  const toggleFavorite = (movie) => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    setFavorites(prev => isFav(movie.id) ? prev.filter(x => x.id !== movie.id) : [...prev, upsertMinimal(movie)])
  }
  
  const toggleWatchlist = (movie) => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    setWatchlist(prev => isInWatchlist(movie.id) ? prev.filter(x => x.id !== movie.id) : [...prev, upsertMinimal(movie)])
  }

  const moveToHistory = (movie) => {
    const movieWithDate = { ...upsertMinimal(movie), dateWatched: new Date().toLocaleDateString() }
    
    // Add to history (avoid duplicates if already there, just update date)
    setHistory(prev => [movieWithDate, ...prev.filter(x => x.id !== movie.id)])
    
    // Remove from watchlist if present
    if (isInWatchlist(movie.id)) {
      setWatchlist(prev => prev.filter(x => x.id !== movie.id))
    }
  }

  const removeFromHistory = (movie) => {
    setHistory(prev => prev.filter(x => x.id !== movie.id))
  }

  const handleLogin = (userEmailOrName) => {
    setIsLoggedIn(true);
    localStorage.setItem('kino_isLoggedIn', 'true');
    
    // Check if input is object (from SignUp) or string (from SignIn)
    const input = typeof userEmailOrName === 'object' ? userEmailOrName.username || userEmailOrName.email : userEmailOrName;
    const userEmail = typeof userEmailOrName === 'object' ? userEmailOrName.email : (userEmailOrName.includes('@') ? userEmailOrName : '');

    // Extract name from email (e.g., "john@gmail.com" -> "john") 
    const name = input.includes('@') 
      ? input.split('@')[0] 
      : input;
  
    // Capitalize first letter 
    const formattedName = name.charAt(0).toUpperCase() + name.slice(1);
  
    setUsername(formattedName); 
    localStorage.setItem('kino_username', formattedName); // Save it!

    // Update Email if provided
    if (userEmail) {
      setEmail(userEmail);
      localStorage.setItem('kino_email', userEmail);
    }
    
    navigate('/dashboard');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('kino_isLoggedIn');
    navigate('/');
  };

  return (
    <div className="app">
      <Navbar isLoggedIn={isLoggedIn} />
      
      <div className="page-transition" key={location.pathname}>
        <Routes>
          <Route path="/" element={
            isLoggedIn ? <Navigate to="/dashboard" /> : <Landing movies={movies} onGetStarted={() => navigate('/signup')} />
          } />
          
          <Route path="/login" element={
            isLoggedIn ? <Navigate to="/dashboard" /> : (
              <SignIn onNavigateToSignUp={() => navigate('/signup')} onLogin={handleLogin} />
            )
          } />
          
          <Route path="/signup" element={
            isLoggedIn ? <Navigate to="/dashboard" /> : (
              <SignUp onNavigateToSignIn={() => navigate('/login')} onSignUp={handleLogin} />
            )
          } />
          
          <Route path="/dashboard" element={
            isLoggedIn ? (
              <Dashboard 
                movies={movies} 
                username={username}
                watchlistCount={watchlist.length}
                favoritesCount={favorites.length}
                historyCount={history.length}
                onLogout={handleLogout}
              />
            ) : <Navigate to="/login" />
          } />
          
          <Route path="/collections" element={<Collections isLoggedIn={isLoggedIn} />} />
          
          <Route path="/collections/:id/:name" element={<CollectionDetail isLoggedIn={isLoggedIn} />} />
          
          <Route path="/watchlist" element={
            isLoggedIn ? (
              <Watchlist 
                watchlist={watchlist} 
                history={history}
                onRemoveFromWatchlist={(movie) => toggleWatchlist(movie)}
                onRemoveFromHistory={(movie) => removeFromHistory(movie)}
                onMoveToHistory={(movie) => moveToHistory(movie)}
              />
            ) : <Navigate to="/login" />
          } />
          
          <Route path="/favorites" element={
            isLoggedIn ? (
              <Favorites movies={favorites} />
            ) : <Navigate to="/login" />
          } />

          <Route path="/profile" element={
            isLoggedIn ? (
              <Profile 
                username={username}
                email={email}
                watchlistCount={watchlist.length}
                favoritesCount={favorites.length}
                historyCount={history.length}
              />
            ) : <Navigate to="/login" />
          } />

          <Route path="/settings" element={
            isLoggedIn ? (
              <Settings username={username} setUsername={setUsername} />
            ) : <Navigate to="/login" />
          } />
          
          <Route path="/search" element={<SearchResults />} />
          
          <Route path="/movie/:id" element={
            <MovieDetail 
              isFavorite={isFav} 
              onToggleFavorite={toggleFavorite}
              isInWatchlist={isInWatchlist}
              onToggleWatchlist={toggleWatchlist}
              isLoggedIn={isLoggedIn}
            />
          } />
        </Routes>
      </div>

      {/* Hide footer on Landing, Login, and Signup pages */}
      {!['/', '/login', '/signup'].includes(location.pathname.replace(/\/$/, '') || '/') && (
        <footer className="footer">
          <div className="footer-container">
            <div className="footer-bottom">
              <p>&copy; 2024 KINO. All rights reserved.</p>
            </div>
          </div>
        </footer>
      )}
    </div>
  )
}

export default App
