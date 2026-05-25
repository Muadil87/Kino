import { useEffect, useState } from 'react'
import { activityApi } from '../services/api'
import ActivityCard from './ActivityCard'
import FeedLayout from './FeedLayout'

const TAB_SCOPES = ['home', 'friends', 'community', 'me']

export default function ActivityLens({
  mode = 'unified',
  defaultScope = 'home',
  pageSize = 8,
  showTabs = false,
  sourceContext,
  title,
}) {
  const [scope, setScope] = useState(defaultScope)
  const [events, setEvents] = useState([])
  const [page, setPage] = useState(1)
  const [meta, setMeta] = useState({ currentPage: 1, lastPage: 1, total: 0 })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setScope(defaultScope)
    setPage(1)
  }, [defaultScope, sourceContext])

  useEffect(() => {
    let ignore = false
    const load = async () => {
      setLoading(true)
      setError('')
      try {
        const res = mode === 'community'
          ? await activityApi.community(sourceContext, { page, perPage: pageSize })
          : await activityApi.unified({ scope, page, perPage: pageSize })
        if (ignore) return
        setEvents(res.items || [])
        setMeta(res.meta || { currentPage: 1, lastPage: 1, total: 0 })
      } catch {
        if (!ignore) setError('Could not load activity right now.')
      } finally {
        if (!ignore) setLoading(false)
      }
    }
    load()
    return () => { ignore = true }
  }, [mode, scope, page, pageSize, sourceContext])

  return (
    <div className="activity-lens">
      {title && <p className="post-author">{title}</p>}
      {showTabs && mode !== 'community' && (
        <div className="social-tabs">
          {TAB_SCOPES.map((s) => (
            <button
              key={s}
              className={`btn-ghost ${scope === s ? 'active' : ''}`}
              onClick={() => {
                setScope(s)
                setPage(1)
              }}
            >
              {s === 'community' ? 'Communities' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      )}
      {error && <p className="social-muted">{error}</p>}
      {loading && <p className="social-muted">Loading activity...</p>}
      {!loading && !error && (
        <FeedLayout
          meta={meta}
          onPrev={() => setPage((p) => Math.max(1, p - 1))}
          onNext={() => setPage((p) => Math.min(meta.lastPage, p + 1))}
        >
          {events.length > 0
            ? events.map((e) => <ActivityCard key={e.id} event={e} />)
            : <p className="social-muted">No activity yet.</p>}
        </FeedLayout>
      )}
    </div>
  )
}
