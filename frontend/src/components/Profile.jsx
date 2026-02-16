import React from 'react';
import './Profile.css';

const Profile = ({ username, email, watchlistCount, favoritesCount, historyCount }) => {
  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-avatar">
            <span className="avatar-initials">{username ? username.substring(0, 2).toUpperCase() : 'US'}</span>
          </div>
          <div className="profile-info">
            <h1 className="profile-username">{username || 'User'}</h1>
            <p className="profile-email">{email || 'user@example.com'}</p>
            <div className="profile-badges">
              <span className="badge">Member since 2024</span>
              <span className="badge pro">Pro</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{watchlistCount}</div>
            <div className="stat-label">Watchlist</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{favoritesCount}</div>
            <div className="stat-label">Favorites</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{historyCount}</div>
            <div className="stat-label">Watched</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">0</div>
            <div className="stat-label">Reviews</div>
          </div>
        </div>

        {/* Activity Section (Placeholder) */}
        <div className="activity-section">
          <h2 className="section-title">Recent Activity</h2>
          <div className="empty-state-small">
            <p>No recent activity to show.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
