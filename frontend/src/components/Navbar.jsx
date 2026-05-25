import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { searchMovies } from '../services/tmdb'
import { tmdbImage } from '../utils/image'
import { Button } from './ui/button'
import { Input } from './ui/input'
import Icon from './ui/Icon'
import './Navbar.css'
import './NavbarSearch.css'

export default function Navbar({ isLoggedIn, onLogout }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [showDropdown, setShowDropdown] = useState(false)
  
  const [showQuickMenu, setShowQuickMenu] = useState(false)
  const searchRef = useRef(null)
  const quickMenuRef = useRef(null)
  const navigate = useNavigate()
  const location = useLocation()

  // Check if we are on a page that requires a transparent navbar
  const isTransparentPage = ['/', '/login', '/signup', '/signin'].includes(location.pathname)

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
      if (quickMenuRef.current && !quickMenuRef.current.contains(event.target)) {
        setShowQuickMenu(false)
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

  const closeAllMenus = () => {
    setShowQuickMenu(false)
    setMobileMenuOpen(false)
  }

  return (
    <nav className={`navbar ${isTransparentPage ? 'transparent' : ''}`}>
      <div className="navbar-container">
        
        <Link to={isLoggedIn ? "/dashboard" : "/"} className="navbar-logo" style={{ textDecoration: 'none' }}>
          <h1 className="logo-text">KINO</h1>
        </Link>

        <div className={`navbar-links ${mobileMenuOpen ? 'active' : ''}`}>
          <Link to={isLoggedIn ? "/dashboard" : "/#trending"} className="nav-link">
            Home
          </Link>
          <Link to="/movies" className="nav-link">
            Movies
          </Link>
          {isLoggedIn && (
            <Link to="/activity" className="nav-link">
              Activity
            </Link>
          )}
          {isLoggedIn && (
            <Link to="/communities" className="nav-link">
              Communities
            </Link>
          )}
          {isLoggedIn && (
            <Link to="/profile" className="nav-link">
              Profile
            </Link>
          )}
        </div>

        <div className="navbar-actions">
          {!isTransparentPage && (
            <div className="search-container" ref={searchRef}>
              <form className="search-form" onSubmit={handleSearchSubmit}>
                <span className="navbar-search-icon"><Icon name="search" size={16} tone="muted" /></span>
                <Input
                  variant="unstyled"
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
          )}
          
          {isLoggedIn ? (
            <>
              <Button
                variant="unstyled"
                size="none"
                className="settings-btn" 
                onClick={() => navigate('/settings')}
                aria-label="Settings"
                title="Settings"
              >
                <Icon name="settings" size={24} tone="muted" />
              </Button>
            </>
          ) : (
            <>
              {location.pathname !== '/login' && (
                <Button variant="unstyled" size="none" className="sign-in-btn" onClick={() => navigate('/login')}>
                  Sign In
                </Button>
              )}
              {location.pathname !== '/signup' && (
                <Button variant="unstyled" size="none" className="sign-up-btn" onClick={() => navigate('/signup')}>
                  Create Account
                </Button>
              )}
            </>
          )}

          <div className="quick-menu-wrap" ref={quickMenuRef}>
            <Button
              variant="unstyled"
              size="none"
              className="menu-btn"
              onClick={() => {
                if (window.innerWidth <= 768) {
                  setMobileMenuOpen((v) => !v)
                  setShowQuickMenu(false)
                } else {
                  setShowQuickMenu((v) => !v)
                }
              }}
              aria-label="Open quick menu"
            >
              <Icon name="menu" size={24} tone="muted" />
            </Button>
            {showQuickMenu && (
              <div className="quick-menu-dropdown">
                <Link to={isLoggedIn ? '/dashboard' : '/'} className="quick-menu-item" onClick={closeAllMenus}><Icon name="trending" size={16} />Trending</Link>
                <Link to="/movies" className="quick-menu-item" onClick={closeAllMenus}><Icon name="browse" size={16} />Browse</Link>
                {isLoggedIn && <Link to="/my-cinema" className="quick-menu-item" onClick={closeAllMenus}><Icon name="watchlist" size={16} />My Cinema</Link>}
                <Link to="/collections" className="quick-menu-item" onClick={closeAllMenus}><Icon name="collections" size={16} />Collections</Link>
                {isLoggedIn && <Link to="/profile" className="quick-menu-item" onClick={closeAllMenus}><Icon name="user" size={16} />Profile</Link>}
                {isLoggedIn && <Link to="/settings" className="quick-menu-item" onClick={closeAllMenus}><Icon name="settings" size={16} />Settings</Link>}
                {isLoggedIn && <Link to="/friends" className="quick-menu-item" onClick={closeAllMenus}><Icon name="user" size={16} />Friends</Link>}
                {isLoggedIn && <Link to="/activity" className="quick-menu-item" onClick={closeAllMenus}><Icon name="sparkles" size={16} />Activity</Link>}
                {isLoggedIn && (
                  <Button variant="unstyled" size="none" className="quick-menu-item quick-menu-logout" onClick={() => { closeAllMenus(); if (onLogout) onLogout(); }}>
                    <Icon name="logout" size={16} />
                    Log Out
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
