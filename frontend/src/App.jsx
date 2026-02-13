import { useState } from 'react'
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom' // ✅ IMPORT THIS
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import LandingHero from './components/LandingHero'
import MovieCard from './components/MovieCard'
import SignIn from './components/SignIn'
import SignUp from './components/SignUp'
import Watchlist from './components/Watchlist'
import Collections from './components/Collections'
import './App.css'

// Sample data (Keep this exactly as you had it)
const mockMovies = [
  { id: 1, title: 'The Ethereal Frame', release_date: '2024', poster_path: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=600&fit=crop', rating: 9.2, genre: 'Drama', description: 'A poetic journey through memory and cinema' },
  { id: 2, title: 'Neon Horizons', release_date: '2024', poster_path: 'https://images.unsplash.com/photo-1533613220915-609f665a6416?w=400&h=600&fit=crop', rating: 8.8, genre: 'Sci-Fi', description: 'Where technology meets the human soul' },
  { id: 3, title: 'Silent Canvas', release_date: '2023', poster_path: 'https://images.unsplash.com/photo-1489599849228-bed2b8904ee2?w=400&h=600&fit=crop', rating: 9.0, genre: 'Thriller', description: 'Visual storytelling at its finest' },
  { id: 4, title: 'Chromatic Dreams', release_date: '2024', poster_path: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=600&fit=crop', rating: 8.5, genre: 'Fantasy', description: 'Colors come alive in this visual spectacle' },
  { id: 5, title: 'The Last Frame', release_date: '2023', poster_path: 'https://images.unsplash.com/photo-1533613220915-609f665a6416?w=400&h=600&fit=crop', rating: 8.9, genre: 'Drama', description: 'A meditation on mortality and cinema' },
  { id: 6, title: 'Luminous Paths', release_date: '2024', poster_path: 'https://images.unsplash.com/photo-1489599849228-bed2b8904ee2?w=400&h=600&fit=crop', rating: 8.7, genre: 'Adventure', description: 'Light guides the way to discovery' }
]

// 1️⃣ Extracting your Dashboard UI into a Component so it fits in a Route
const Dashboard = ({ movies }) => {
  const featuredMovie = movies[0];
  
  return (
    <>
      {/* Hero Section */}
      <HeroSection movie={featuredMovie} />

      {/* Trending Section */}
      <section className="section trending-section">
        <div className="section-header">
          <div>
            <h2 className="section-title">Trending</h2>
            <div className="title-underline"></div>
          </div>
          <button className="view-all-btn">
            View All
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
        <div className="movie-grid">
          {movies.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="section cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Discover Your Next Favorite Film</h2>
          <p className="cta-text">
            Explore our curated collection of extraordinary cinema. From indie darlings to blockbuster spectacles, KINO brings the world of film to your fingertips.
          </p>
          <button className="btn-primary">
             Start Watching
          </button>
        </div>
      </section>

      {/* Staff Picks Section */}
      <section className="section staff-picks-section">
        <div className="section-header">
           <div>
             <h2 className="section-title">Staff Picks</h2>
             <div className="title-underline"></div>
           </div>
        </div>
        <div className="picks-grid">
           {movies.slice(0, 3).map((movie) => (
             <div key={movie.id} className="pick-card">
                <div className="pick-header">
                   <div>
                     <h3 className="pick-title">{movie.title}</h3>
                     <p className="pick-year">{movie.release_date}</p>
                   </div>
                   <div className="pick-rating">
                      <span>{movie.rating}</span>
                   </div>
                </div>
                <p className="pick-description">{movie.description}</p>
             </div>
           ))}
        </div>
      </section>
    </>
  );
};

// 2️⃣ The Main App Component
function App() {
  const [movies] = useState(mockMovies)
  // Initialize state from localStorage to persist login
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('kino_isLoggedIn') === 'true'
  })
  
  const navigate = useNavigate();

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

  // 3️⃣ Adapter to make your existing Navbar work with Router
  // If your Navbar calls onNavigate('signin'), we translate that to navigate('/login')
  const handleNavigation = (destination) => {
    if (destination === 'signin') navigate('/login');
    if (destination === 'signup') navigate('/signup');
    if (destination === 'landing') navigate('/');
    if (destination === 'dashboard') navigate('/dashboard');
  };

  return (
    <div className="app">
      {/* Navbar sits outside Routes so it's always visible */}
      <Navbar 
        isLoggedIn={isLoggedIn} 
        setIsLoggedIn={handleLogout} 
      />
      
      {/* 4️⃣ The Router Map */}
      <Routes>
        {/* Public Routes - Redirect if already logged in */}
        <Route path="/" element={
          isLoggedIn ? <Navigate to="/dashboard" /> : <LandingHero onGetStarted={() => navigate('/signup')} />
        } />
        
        <Route path="/login" element={
          isLoggedIn ? <Navigate to="/dashboard" /> : (
            <SignIn 
              onNavigateToSignUp={() => navigate('/signup')} 
              onLogin={handleLogin} 
            />
          )
        } />
        
        <Route path="/signup" element={
          isLoggedIn ? <Navigate to="/dashboard" /> : (
            <SignUp 
              onNavigateToSignIn={() => navigate('/login')} 
              onSignUp={handleLogin} 
            />
          )
        } />

        {/* Protected Routes - Only show if logged in */}
        <Route 
          path="/dashboard" 
          element={
            isLoggedIn ? <Dashboard movies={movies} /> : <Navigate to="/login" />
          } 
        />
        <Route 
          path="/watchlist" 
          element={
            isLoggedIn ? <Watchlist movies={movies} /> : <Navigate to="/login" />
          } 
        />
        <Route 
          path="/collections" 
          element={
            isLoggedIn ? <Collections movies={movies} /> : <Navigate to="/login" />
          } 
        />
      </Routes>

      {/* Footer */}
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