import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom' // ✅ Import Router tools
import './Navbar.css'

// We don't need 'onNavigate' anymore because we have the router!
export default function Navbar({ isLoggedIn, setIsLoggedIn }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navigate = useNavigate() // ✅ Hook for button navigation

  const handleLogout = () => {
    setIsLoggedIn(); // Calls the logout function passed from App.jsx
    navigate('/');   // Redirect to home
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        
        {/* Logo - Uses Link for instant home travel */}
        <Link to={isLoggedIn ? "/dashboard" : "/"} className="navbar-logo" style={{ textDecoration: 'none' }}>
          <div className="logo-icon">K</div>
          <h1 className="logo-text">KINO</h1>
        </Link>

        {/* Center Navigation */}
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
        </div>

        {/* Right Actions */}
        <div className="navbar-actions">
          {/* Search (Visual only for now) */}
          <button className="search-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
          </button>
          
          {isLoggedIn ? (
            <button className="sign-in-btn" onClick={handleLogout}>
                Sign Out
            </button>
          ) : (
            <>
              {/* We use navigate() for buttons to keep your styling exact */}
              <button className="sign-in-btn" onClick={() => navigate('/login')}>
                Sign In
              </button>
              <button className="sign-up-btn" onClick={() => navigate('/signup')}>
                Create Account
              </button>
            </>
          )}

          {/* Mobile Menu Toggle */}
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