import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { searchMovies } from '../services/tmdb'
import { tmdbImage } from '../utils/image'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { DropdownMenu } from './ui/dropdown-menu'
import Icon from './ui/Icon'
import './Navbar.css'
import './NavbarSearch.css'

export default function Navbar({ isLoggedIn, onLogout }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [showDropdown, setShowDropdown] = useState(false)
  
  const searchRef = useRef(null)
  const navigate = useNavigate()
  const location = useLocation()

  // Check if we are on a page that requires a transparent navbar
  const isHomePage = location.pathname === '/'
  const isTransparentPage = ['/', '/login', '/signup', '/signin'].includes(location.pathname)
  const showNavbarSearch = isHomePage || !isTransparentPage

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
    <nav className={`navbar ${isTransparentPage ? 'transparent' : ''} ${isHomePage ? 'home-navbar' : ''}`}>
      <div className="navbar-container">
        
        <Link to="/" className="navbar-logo" style={{ textDecoration: 'none' }}>
          <h1 className="logo-text">KINO</h1>
        </Link>

        <div className={`navbar-links ${mobileMenuOpen ? 'active' : ''}`}>
          <Link to="/" className={`nav-link ${isHomePage ? 'active' : ''}`}>
            Home
          </Link>
          <Link to="/movies" className={`nav-link ${location.pathname === '/movies' ? 'active' : ''}`}>
            Movies
          </Link>
          {(isLoggedIn || isHomePage) && (
            <Link to={isLoggedIn ? '/activity' : '/login'} className={`nav-link ${location.pathname === '/activity' ? 'active' : ''}`}>
              Activity
            </Link>
          )}
          {(isLoggedIn || isHomePage) && (
            <Link to={isLoggedIn ? '/profile' : '/signup'} className={`nav-link ${location.pathname === '/profile' ? 'active' : ''}`}>
              Profile
            </Link>
          )}
        </div>

        <div className="navbar-actions">
          {showNavbarSearch && (
            <div className="search-container" ref={searchRef}>
              <form className="search-form" onSubmit={handleSearchSubmit}>
                <span className="navbar-search-icon"><Icon name="search" size={16} tone="muted" /></span>
                <Input
                  variant="unstyled"
                  type="search"
                  className="search-input"
                  placeholder={isHomePage ? 'Search movies, actors, directors...' : 'Search movies...'}
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
                onClick={() => navigate('/profile')}
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

          <DropdownMenu
            className="quick-menu-wrap"
            trigger={(
              <Button
                variant="unstyled"
                size="none"
                className="menu-btn"
                aria-label="Open navigation menu"
              >
                <Icon name="menu" size={24} tone="muted" />
              </Button>
            )}
          >
            {({ close }) => isLoggedIn ? (
              <div className="quick-menu-dropdown">
                <Link to="/profile" className="quick-menu-item" onClick={close}>
                  <Icon name="user" size={16} />
                  Profile
                </Link>
                <Button
                  variant="unstyled"
                  size="none"
                  className="quick-menu-item quick-menu-logout"
                  onClick={() => {
                    close()
                    onLogout?.()
                  }}
                >
                  <Icon name="logout" size={16} />
                  Log Out
                </Button>
              </div>
            ) : null}
          </DropdownMenu>
        </div>
      </div>
    </nav>
  )
}
