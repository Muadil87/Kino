import React, { useState } from 'react'
import './Navbar.css'

export default function Navbar({ isLoggedIn, setIsLoggedIn, onNavigate }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <div className="navbar-logo" onClick={() => onNavigate('landing')} style={{ cursor: 'pointer' }}>
          <div className="logo-icon">K</div>
          <h1 className="logo-text">KINO</h1>
        </div>

        {/* Center Navigation */}
        <div className="navbar-links">
          <a href="#" className="nav-link" onClick={() => onNavigate('landing')}>
            Trending
          </a>
          <a href="#" className="nav-link">
            Collections
          </a>
          {isLoggedIn && (
            <a href="#" className="nav-link">
              My Watchlist
            </a>
          )}
        </div>

        {/* Right Actions */}
        <div className="navbar-actions">
          <button className="search-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
          </button>
          
          {isLoggedIn ? (
            <button className="sign-in-btn" onClick={() => setIsLoggedIn()}>Sign Out</button>
          ) : (
            <>
              <button className="sign-in-btn" onClick={() => onNavigate('signin')}>Sign In</button>
              <button className="sign-up-btn" onClick={() => onNavigate('signup')}>Create Account</button>
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
