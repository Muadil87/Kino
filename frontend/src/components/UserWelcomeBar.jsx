import React from 'react';
import { useNavigate } from 'react-router-dom';
import './UserWelcomeBar.css';

const UserWelcomeBar = ({ username, watchlistCount = 0, favoritesCount = 0, historyCount = 0, onLogout }) => {
  const navigate = useNavigate();
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="user-welcome-bar">
      {/* Left Side: Avatar + Greeting */}
      <div 
        className="user-info-section" 
        onClick={() => navigate('/profile')}
        role="button"
        tabIndex={0}
      >
        <div className="welcome-avatar">
          {username ? username.charAt(0).toUpperCase() : 'U'}
        </div>
        <div className="welcome-text">
          <span className="greeting-label">{getGreeting()},</span>
          <span className="username-label">{username || 'User'}</span>
        </div>
      </div>

      {/* Right Side: User Stats */}
      <div className="user-stats-section">
        <div className="stat-item" onClick={() => navigate('/watchlist')}>
          <span className="stat-value">{watchlistCount}</span>
          <span className="stat-label">Watchlist</span>
        </div>
        <div className="stat-divider"></div>
        <div className="stat-item" onClick={() => navigate('/favorites')}>
          <span className="stat-value">{favoritesCount}</span>
          <span className="stat-label">Favorites</span>
        </div>
        <div className="stat-divider"></div>
        <div className="stat-item" onClick={() => navigate('/watchlist')}>
          <span className="stat-value">{historyCount}</span>
          <span className="stat-label">Watched</span>
        </div>
        
        {/* Logout Button */}
        <div className="stat-divider"></div>
        <button 
          className="logout-btn" 
          onClick={(e) => {
            e.stopPropagation();
            if (onLogout) onLogout();
          }} 
          title="Log Out"
          type="button"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default UserWelcomeBar;
