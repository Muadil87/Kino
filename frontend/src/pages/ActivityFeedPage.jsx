import { useEffect, useState } from 'react'
import { activityApi } from '../services/api'
import ActivityLens from '../components/ActivityLens'
import '../components/Social.css'

export default function ActivityFeedPage() {
  const [countMeta, setCountMeta] = useState({ total: 0 })
  useEffect(() => {
    activityApi.unified({ scope: 'friends', page: 1, perPage: 1 }).then((res) => {
      setCountMeta(res.meta || { total: 0 })
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
      <ActivityLens pageSize={12} defaultScope="friends" />
    </section>
  )
}
