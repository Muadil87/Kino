import React, { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import LandingHero from './components/LandingHero'
import MovieCard from './components/MovieCard'
import SignIn from './components/SignIn'
import SignUp from './components/SignUp'
import './App.css'

// Sample data - replace with API calls to your Laravel backend
const mockMovies = [
  {
    id: 1,
    title: 'The Ethereal Frame',
    release_date: '2024',
    poster_path: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=600&fit=crop',
    rating: 9.2,
    genre: 'Drama',
    description: 'A poetic journey through memory and cinema'
  },
  {
    id: 2,
    title: 'Neon Horizons',
    release_date: '2024',
    poster_path: 'https://images.unsplash.com/photo-1533613220915-609f665a6416?w=400&h=600&fit=crop',
    rating: 8.8,
    genre: 'Sci-Fi',
    description: 'Where technology meets the human soul'
  },
  {
    id: 3,
    title: 'Silent Canvas',
    release_date: '2023',
    poster_path: 'https://images.unsplash.com/photo-1489599849228-bed2b8904ee2?w=400&h=600&fit=crop',
    rating: 9.0,
    genre: 'Thriller',
    description: 'Visual storytelling at its finest'
  },
  {
    id: 4,
    title: 'Chromatic Dreams',
    release_date: '2024',
    poster_path: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=600&fit=crop',
    rating: 8.5,
    genre: 'Fantasy',
    description: 'Colors come alive in this visual spectacle'
  },
  {
    id: 5,
    title: 'The Last Frame',
    release_date: '2023',
    poster_path: 'https://images.unsplash.com/photo-1533613220915-609f665a6416?w=400&h=600&fit=crop',
    rating: 8.9,
    genre: 'Drama',
    description: 'A meditation on mortality and cinema'
  },
  {
    id: 6,
    title: 'Luminous Paths',
    release_date: '2024',
    poster_path: 'https://images.unsplash.com/photo-1489599849228-bed2b8904ee2?w=400&h=600&fit=crop',
    rating: 8.7,
    genre: 'Adventure',
    description: 'Light guides the way to discovery'
  }
]

function App() {
  const [movies, setMovies] = useState(mockMovies)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [view, setView] = useState('landing') // 'landing', 'signin', 'signup'
  const featuredMovie = movies[0]

  const handleLogin = () => {
    setIsLoggedIn(true)
    setView('dashboard')
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setView('landing')
  }

  const navigateTo = (newView) => {
    setView(newView)
    window.scrollTo(0, 0)
  }

  return (
    <div className="app">
      <Navbar 
        isLoggedIn={isLoggedIn} 
        setIsLoggedIn={handleLogout} 
        onNavigate={navigateTo}
      />
      
      {isLoggedIn ? (
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

            {/* Movie Grid */}
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
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21"></polygon>
                </svg>
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
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="12 2 15.09 10.26 23.77 11.27 17.88 17.14 19.54 25.98 12 21.77 4.46 25.98 6.12 17.14 0.23 11.27 8.91 10.26"></polygon>
                      </svg>
                      <span>{movie.rating}</span>
                    </div>
                  </div>
                  
                  <p className="pick-description">{movie.description}</p>
                  
                  <div className="pick-buttons">
                    <button className="btn-learn-more">Learn More</button>
                    <button className="btn-watchlist">Add to Watchlist</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      ) : (
        <>
          {view === 'landing' && <LandingHero onGetStarted={() => navigateTo('signup')} />}
          {view === 'signin' && <SignIn onNavigateToSignUp={() => navigateTo('signup')} onLogin={handleLogin} />}
          {view === 'signup' && <SignUp onNavigateToSignIn={() => navigateTo('signin')} onSignUp={handleLogin} />}
        </>
      )}

      {/* Footer - Always visible or conditional? Letterboxd has it always */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-grid">
            <div className="footer-col">
              <h3 className="footer-title">KINO</h3>
              <p className="footer-text">
                Celebrating the art of cinema through discovery and curation.
              </p>
            </div>
            <div className="footer-col">
              <h4 className="footer-subtitle">Explore</h4>
              <ul className="footer-links">
                <li><a href="#">Trending</a></li>
                <li><a href="#">New Releases</a></li>
                <li><a href="#">Collections</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4 className="footer-subtitle">Community</h4>
              <ul className="footer-links">
                <li><a href="#">Reviews</a></li>
                <li><a href="#">Lists</a></li>
                <li><a href="#">Forum</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4 className="footer-subtitle">Follow</h4>
              <ul className="footer-links">
                <li><a href="#">Instagram</a></li>
                <li><a href="#">Twitter</a></li>
                <li><a href="#">YouTube</a></li>
              </ul>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>&copy; 2024 KINO. All rights reserved. Celebrating cinema.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
