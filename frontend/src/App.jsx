import { useState, useEffect } from 'react' // ✅ Added useEffect
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom'
import { getTrendingMovies } from './services/tmdb' // ✅ Import the API service
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import LandingHero from './components/LandingHero'
import MovieCard from './components/MovieCard'
import SignIn from './components/SignIn'
import SignUp from './components/SignUp'
import Watchlist from './components/Watchlist'
import Collections from './components/Collections'
import MovieDetail from './components/MovieDetail'
import SearchResults from './components/SearchResults'
import Favorites from './components/Favorites'
import './App.css'

// ❌ DELETED: const mockMovies = [...] (We don't need this anymore!)

// 1️⃣ The Dashboard Component (Updated to handle loading)
const Dashboard = ({ movies }) => {
  // ✅ Loading Check: If data hasn't arrived yet, show a loading text
  if (!movies || movies.length === 0) {
    return <div className="loading-screen">Loading amazing movies...</div>;
  }

  return (
    <>
      {/* Trending Section */}
      <section className="section trending-section">
        <div className="section-header">
          <div>
            <h2 className="section-title">Trending</h2>
            <div className="title-underline"></div>
          </div>
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
           <div>
             <h2 className="section-title">Staff Picks</h2>
             <div className="title-underline"></div>
           </div>
        </div>
        <div className="picks-grid">
           {/* We take movies 4, 5, and 6 for "Staff Picks" just to show something different */}
           {movies.slice(4, 7).map((movie) => (
             <div key={movie.id} className="pick-card">
                <div className="pick-header">
                   <div>
                     <h3 className="pick-title">{movie.title}</h3>
                     <p className="pick-year">{movie.release_date ? movie.release_date.split('-')[0] : 'N/A'}</p>
                   </div>
                   <div className="pick-rating">
                      <span>{movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}</span>
                   </div>
                </div>
                {/* Overview is often long, so we limit it */}
                <p className="pick-description">
                    {movie.overview ? movie.overview.substring(0, 100) + '...' : 'No description available.'}
                </p>
             </div>
           ))}
        </div>
      </section>
    </>
  );
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
  
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('kino_isLoggedIn') === 'true'
  })
  
  const navigate = useNavigate();

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
  
  const isFav = (id) => favorites.some(m => m.id === id)
  const isInWatchlist = (id) => watchlist.some(m => m.id === id)
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
    setFavorites(prev => isFav(movie.id) ? prev.filter(x => x.id === undefined || x.id !== movie.id) : [...prev, upsertMinimal(movie)])
  }
  const toggleWatchlist = (movie) => {
    setWatchlist(prev => isInWatchlist(movie.id) ? prev.filter(x => x.id === undefined || x.id !== movie.id) : [...prev, upsertMinimal(movie)])
  }

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem('kino_isLoggedIn', 'true');
    navigate('/dashboard');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('kino_isLoggedIn');
    navigate('/');
  };

  return (
    <div className="app">
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={handleLogout} />
      
      <Routes>
        <Route path="/" element={
          isLoggedIn ? <Navigate to="/dashboard" /> : <LandingHero onGetStarted={() => navigate('/signup')} />
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

        {/* Protected Routes */}
        <Route 
          path="/dashboard" 
          element={
            isLoggedIn ? <Dashboard movies={movies} /> : <Navigate to="/login" />
          } 
        />
        <Route 
          path="/watchlist" 
          element={
            isLoggedIn ? <Watchlist movies={watchlist} /> : <Navigate to="/login" />
          } 
        />
        <Route 
          path="/favorites" 
          element={
            isLoggedIn ? <Favorites movies={favorites} /> : <Navigate to="/login" />
          } 
        />
        <Route 
          path="/collections" 
          element={
            isLoggedIn ? <Collections movies={movies} /> : <Navigate to="/login" />
          } 
        />
        <Route 
          path="/movie/:id" 
          element={
            isLoggedIn ? (
              <MovieDetail 
                movies={movies} 
                onToggleFavorite={toggleFavorite}
                onToggleWatchlist={toggleWatchlist}
                isFavorite={isFav}
                isInWatchlist={isInWatchlist}
              />
            ) : <Navigate to="/login" />
          } 
        />
        <Route 
          path="/search" 
          element={
            isLoggedIn ? <SearchResults /> : <Navigate to="/login" />
          } 
        />
      </Routes>

      <footer className="footer">
        <div className="footer-container">
           <div className="footer-bottom">
             <p>&copy; 2024 KINO. All rights reserved.</p>
           </div>
        </div>
      </footer>
    </div>
  )
}

export default App
