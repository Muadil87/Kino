export default function RecommendationInbox({ items = [], onUpdate }) {
  if (!items.length) return <div className="kino-panel social-empty-panel">No recommendations in your inbox yet.</div>

  return (
    <div className="post-list">
      {items.map((item) => (
        <article key={item.id} className="kino-panel post-card">
          <p className="post-author">{item.from_user?.name || 'Member'} · recommendation</p>
          <p className="social-feature-text">{item.movie?.title || 'Movie'}</p>
          {item.note && <p className="social-muted">{item.note}</p>}
          <div className="community-actions">
            <button className="btn-ghost" onClick={() => onUpdate(item.id, 'seen')}>Seen</button>
            <button className="btn-ghost" onClick={() => onUpdate(item.id, 'accepted')}>Accept</button>
            <button className="btn-ghost" onClick={() => onUpdate(item.id, 'dismissed')}>Dismiss</button>
          </div>
        </article>
      ))}
    </div>
  )
}
