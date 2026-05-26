import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { activityApi, recommendationApi } from '../services/api'
import ActivityLens from '../components/ActivityLens'
import '../components/Social.css'

export default function ActivityFeedPage() {
  const [countMeta, setCountMeta] = useState({ total: 0 })
  const [newRecommendations, setNewRecommendations] = useState([])

  useEffect(() => {
    Promise.all([
      activityApi.unified({ scope: 'friends', page: 1, perPage: 1 }),
      recommendationApi.inbox(),
    ]).then(([activityRes, inboxRes]) => {
      setCountMeta(activityRes.meta || { total: 0 })
      const incoming = (inboxRes.items || []).filter((item) => item.status === 'sent')
      setNewRecommendations(incoming.slice(0, 2))
    }).catch(() => {
      setCountMeta({ total: 0 })
      setNewRecommendations([])
    })
  }, [])

  return (
    <section className="social-page">
      <div className="section-header">
        <div>
          <p className="kino-overline">Live Feed</p>
          <h1 className="section-title">Activity Feed</h1>
        </div>
        <p className="section-subtitle">Recent activity from people you follow.</p>
      </div>

      <div className="social-toolbar">
        <p className="social-count">{countMeta.total} events</p>
      </div>

      {newRecommendations.length > 0 && (
        <div className="kino-panel social-surface-card activity-recommendation-alert">
          <p className="post-author">Inbox</p>
          <p className="social-feature-text">New recommendation for you</p>
          {newRecommendations.map((item) => (
            <p key={item.id} className="social-muted">
              {item.from_user?.name || 'Member'} recommended {item.movie?.title || 'a movie'}
            </p>
          ))}
          <Link className="btn-ghost" to="/my-cinema?tab=recommendations">Open Recommendations</Link>
        </div>
      )}

      <ActivityLens pageSize={12} defaultScope="friends" />
    </section>
  )
}
