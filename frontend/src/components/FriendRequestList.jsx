export default function FriendRequestList({ requests = [], onAccept, onDecline }) {
  if (!requests.length) return <div className="kino-panel social-empty-panel">No pending friend requests right now.</div>

  return (
    <div className="post-list">
      {requests.map((req) => (
        <div key={req.id} className="kino-panel friend-request-card">
          <div>
            <p className="post-author">{req.requester?.name || 'User'}</p>
            <p className="social-muted">{req.requester?.email}</p>
          </div>
          <div className="community-actions">
            <button className="btn-ghost" onClick={() => onAccept(req.id)}>Accept</button>
            <button className="btn-ghost" onClick={() => onDecline(req.id)}>Decline</button>
          </div>
        </div>
      ))}
    </div>
  )
}
