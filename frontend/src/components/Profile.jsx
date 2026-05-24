import React from 'react'
import { Card } from './ui/card'
import './Profile.css'

const Profile = ({ username, email, watchlistCount, favoritesCount, historyCount }) => {
  return (
    <div className="profile-page">
      <div className="profile-container">
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

        <div className="stats-grid">
          <Card className="stat-card">
            <div className="stat-value">{watchlistCount}</div>
            <div className="stat-label">Watchlist</div>
          </Card>
          <Card className="stat-card">
            <div className="stat-value">{favoritesCount}</div>
            <div className="stat-label">Favorites</div>
          </Card>
          <Card className="stat-card">
            <div className="stat-value">{historyCount}</div>
            <div className="stat-label">Watched</div>
          </Card>
          <Card className="stat-card">
            <div className="stat-value">0</div>
            <div className="stat-label">Reviews</div>
          </Card>
        </div>

        <Card className="activity-section">
          <h2 className="section-title">Recent Activity</h2>
          <div className="empty-state-small">
            <p>No recent activity to show.</p>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default Profile
