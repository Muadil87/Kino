import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { searchMovies } from '../services/tmdb'
import { tmdbImage } from '../utils/image'
import './Navbar.css'
import './NavbarSearch.css'

export default function Navbar({ isLoggedIn }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [showDropdown, setShowDropdown] = useState(false)
  const searchRef = useRef(null)
  const navigate = useNavigate()

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Debounced search
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchTerm.trim().length > 1) {
        try {
          const results = await searchMovies(searchTerm)
          setSearchResults(results ? results.slice(0, 5) : [])
          setShowDropdown(true)
        } catch (error) {
          console.error("Search failed", error)
        }
      } else {
        setSearchResults([])
        setShowDropdown(false)
      }
    }, 300)

    return () => clearTimeout(delayDebounceFn)
  }, [searchTerm])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    const q = searchTerm.trim()
    if (!q) return
    navigate(`/search?q=${encodeURIComponent(q)}`)
    setMobileMenuOpen(false)
    setShowDropdown(false)
  }

  const handleResultClick = () => {
    setShowDropdown(false)
    setSearchTerm('')
    setMobileMenuOpen(false)
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        
        <Link to={isLoggedIn ? "/dashboard" : "/"} className="navbar-logo" style={{ textDecoration: 'none' }}>
          <h1 className="logo-text">KINO</h1>
        </Link>

        <div className={`navbar-links ${mobileMenuOpen ? 'active' : ''}`}>
          <Link to={isLoggedIn ? "/dashboard" : "/#trending"} className="nav-link">
            Trending
          </Link>
          <Link to="/collections" className="nav-link">
            Collections
          </Link>
          {isLoggedIn && (
            <Link to="/watchlist" className="nav-link">
              My Watchlist
            </Link>
          )}
          {isLoggedIn && (
            <Link to="/favorites" className="nav-link">
              Favorites
            </Link>
          )}
        </div>

        <div className="navbar-actions">
          <div className="search-container" ref={searchRef}>
            <form className="search-form" onSubmit={handleSearchSubmit}>
              <input
                type="search"
                className="search-input"
                placeholder="Search movies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => {
                  if (searchTerm.trim().length > 1) setShowDropdown(true)
                }}
              />
            </form>
            
            {showDropdown && (
              <div className="search-dropdown">
                {searchResults.length > 0 ? (
                  searchResults.map(movie => (
                    <Link 
                      key={movie.id} 
                      to={`/movie/${movie.id}`} 
                      className="search-result-item"
                      onClick={handleResultClick}
                    >
                      <img 
                        src={tmdbImage(movie.poster_path, 'w92')} 
                        alt={movie.title} 
                        className="search-result-poster"
                      />
                      <div className="search-result-info">
                        <span className="search-result-title">{movie.title}</span>
                        <span className="search-result-year">
                          {movie.release_date ? movie.release_date.substring(0, 4) : 'N/A'}
                        </span>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="no-results">No results found</div>
                )}
              </div>
            )}
          </div>
          
          {isLoggedIn ? (
            <button 
              className="settings-btn" 
              onClick={() => navigate('/settings')}
              aria-label="Settings"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
              </svg>
            </button>
          ) : (
            <>
              <button className="sign-in-btn" onClick={() => navigate('/login')}>
                Sign In
              </button>
              <button className="sign-up-btn" onClick={() => navigate('/signup')}>
                Create Account
              </button>
            </>
          )}

          <button 
            className="menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>
    </nav>
  )
}
