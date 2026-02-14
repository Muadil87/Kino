import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Navbar.css'

export default function Navbar({ isLoggedIn, setIsLoggedIn }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()

  const handleLogout = () => {
    setIsLoggedIn();
    navigate('/');
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    const q = searchTerm.trim()
    if (!q) return
    navigate(`/search?q=${encodeURIComponent(q)}`)
    setMobileMenuOpen(false)
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        
        <Link to={isLoggedIn ? "/dashboard" : "/"} className="navbar-logo" style={{ textDecoration: 'none' }}>
          <div className="logo-icon">K</div>
          <h1 className="logo-text">KINO</h1>
        </Link>

        <div className={`navbar-links ${mobileMenuOpen ? 'active' : ''}`}>
          <Link to={isLoggedIn ? "/dashboard" : "/"} className="nav-link">
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
          <form className="search-form" onSubmit={handleSearchSubmit}>
            <input
              type="search"
              className="search-input"
              placeholder="Search movies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>
          
          {isLoggedIn ? (
            <button className="sign-in-btn" onClick={handleLogout}>
                Sign Out
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
