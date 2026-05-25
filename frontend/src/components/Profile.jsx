import React from 'react'
import { Card } from './ui/card'
import Icon from './ui/Icon'
import BadgeChip from './BadgeChip'
import ActivityLens from './ActivityLens'
import './Profile.css'

const badgeLabel = (code) => {
  const map = {
    first_watch: 'First Watch',
    cinephile_10: 'Cinephile 10',
    first_review: 'First Review',
    streak_7: '7-Day Streak',
  }
  return map[code] || code?.replaceAll('_', ' ') || 'Badge'
}

const Profile = ({ username, email, watchlistCount, favoritesCount, historyCount, meProgress, publicProfile }) => {
  const level = meProgress?.level ?? 1
  const xp = meProgress?.xp_total ?? 0
  const nextLevelXp = level * 100
  const currentLevelStart = (level - 1) * 100
  const progressPct = Math.max(0, Math.min(100, ((xp - currentLevelStart) / Math.max(1, nextLevelXp - currentLevelStart)) * 100))
  const badges = meProgress?.badges || []
  const recentActivity = publicProfile?.recent_activity || []
  const topMovies = publicProfile?.top_movies || []
  const communityInvolvement = recentActivity.filter((e) => !!e.community_id).length

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="section-header profile-header">
          <div className="profile-header-main">
            <p className="kino-overline">Account</p>
            <h1 className="section-title">{username || 'User'}</h1>
            <p className="section-subtitle profile-email">{email || 'user@example.com'}</p>
            <div className="identity-chips">
              <span className="identity-chip">Level {level}</span>
              <span className="identity-chip">{xp} XP</span>
              <span className="identity-chip">{meProgress?.current_streak_days ?? 0} day streak</span>
            </div>
            <div className="xp-track">
              <div className="xp-fill" style={{ width: `${progressPct}%` }} />
            </div>
            <p className="xp-caption">{xp}/{nextLevelXp} XP to next level</p>
          </div>
          <div className="profile-avatar">
            <span className="avatar-initials">{username ? username.substring(0, 2).toUpperCase() : 'US'}</span>
          </div>
        </div>

        <div className="stats-grid">
          <Card className="stat-card kino-panel">
            <div className="stat-value">{watchlistCount}</div>
            <div className="stat-label"><Icon name="watchlist" size={16} />Watchlist</div>
          </Card>
          <Card className="stat-card kino-panel">
            <div className="stat-value">{favoritesCount}</div>
            <div className="stat-label"><Icon name="favorites" size={16} />Favorites</div>
          </Card>
          <Card className="stat-card kino-panel">
            <div className="stat-value">{historyCount}</div>
            <div className="stat-label"><Icon name="history" size={16} />Watched</div>
          </Card>
          <Card className="stat-card kino-panel">
            <div className="stat-value">{meProgress?.reviews_count ?? 0}</div>
            <div className="stat-label"><Icon name="star" size={16} />Reviews</div>
          </Card>
          <Card className="stat-card kino-panel">
            <div className="stat-value">{communityInvolvement}</div>
            <div className="stat-label"><Icon name="sparkles" size={16} />Community Activity</div>
          </Card>
        </div>

        <Card className="activity-section kino-panel">
          <h2 className="section-title">Badges</h2>
          <div className="badges-row">
            {badges.slice(0, 6).map((badge) => (
              <BadgeChip key={badge.id || badge.badge_code} label={badgeLabel(badge.badge_code)} />
            ))}
            {badges.length === 0 && <p className="social-muted">No badges yet. Start logging to earn your first one.</p>}
          </div>
        </Card>

        <Card className="activity-section kino-panel">
          <h2 className="section-title">Top Movies</h2>
          <div className="top-movies-row">
            {topMovies.slice(0, 6).map((movie) => (
              <div key={movie.id} className="top-movie-item">
                <p className="top-movie-title">{movie.title}</p>
              </div>
            ))}
            {topMovies.length === 0 && <p className="social-muted">No watched movies yet.</p>}
          </div>
        </Card>

        <Card className="activity-section kino-panel">
          <h2 className="section-title">Recent Activity</h2>
          <ActivityLens mode="unified" defaultScope="me" pageSize={8} />
        </Card>
      </div>
    </div>
  )
}

export default Profile
