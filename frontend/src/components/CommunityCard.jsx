import { Link } from 'react-router-dom'

export default function CommunityCard({ community, actionLabel, onAction }) {
  return (
    <article className="kino-panel community-card social-surface-card">
      <h3>{community.name}</h3>
      <p className="social-muted">{community.description || 'No description yet.'}</p>
      <div className="community-card-footer">
        <span className="community-visibility">{String(community.visibility || '').replace('_', ' ')}</span>
        <div className="community-actions">
          <Link to={`/communities/${community.slug}`} className="btn-ghost">Open</Link>
          {onAction && <button className="btn-ghost" onClick={onAction}>{actionLabel}</button>}
        </div>
      </div>
    </article>
  )
}
