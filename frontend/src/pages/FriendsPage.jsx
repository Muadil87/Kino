import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { activityApi, friendApi } from '../services/api'
import ActivityCard from '../components/ActivityCard'
import FriendRequestList from '../components/FriendRequestList'
import '../components/Social.css'

export default function FriendsPage() {
  const [friends, setFriends] = useState([])
  const [requests, setRequests] = useState([])
  const [email, setEmail] = useState('')
  const [page, setPage] = useState(1)
  const [meta, setMeta] = useState({ currentPage: 1, lastPage: 1, total: 0 })
  const [refreshKey, setRefreshKey] = useState(0)
  const [friendHighlights, setFriendHighlights] = useState([])

  useEffect(() => {
    let ignore = false
    ;(async () => {
      const [f, r] = await Promise.all([friendApi.list(), friendApi.requests({ page, perPage: 10 })])
      const highlights = await activityApi.unified({ scope: 'friends', page: 1, perPage: 6 })
      if (ignore) return
      setFriends(f)
      setRequests(r.items || [])
      setMeta(r.meta || { currentPage: 1, lastPage: 1, total: 0 })
      setFriendHighlights(highlights.items || [])
    })()
    return () => {
      ignore = true
    }
  }, [page, refreshKey])

  return (
    <section className="social-page">
      <div className="section-header">
        <div>
          <p className="kino-overline">Your Circle</p>
          <h1 className="section-title">Friends</h1>
        </div>
        <p className="section-subtitle">Track trusted taste, shared discoveries, and social momentum in one place.</p>
      </div>

      <form
        className="kino-panel social-form social-form-compact"
        onSubmit={(e) => {
          e.preventDefault()
          if (!email.trim()) return
          friendApi.send({ email }).then(() => {
            setEmail('')
            setPage(1)
            setRefreshKey((v) => v + 1)
          })
        }}
      >
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Invite by email" />
        <button className="btn-ghost" type="submit">Send Request</button>
      </form>

      <div className="social-toolbar">
        <h3 className="social-subtitle">Pending Requests</h3>
        <p className="social-count">{meta.total} pending</p>
      </div>
      <FriendRequestList
        requests={requests}
        onAccept={(id) => friendApi.accept(id).then(() => setRefreshKey((v) => v + 1))}
        onDecline={(id) => friendApi.decline(id).then(() => setRefreshKey((v) => v + 1))}
      />

      <div className="social-pager">
        <button className="btn-ghost" disabled={meta.currentPage <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Prev</button>
        <span className="social-page-label">Page {meta.currentPage} of {meta.lastPage}</span>
        <button className="btn-ghost" disabled={meta.currentPage >= meta.lastPage} onClick={() => setPage((p) => Math.min(meta.lastPage, p + 1))}>Next</button>
      </div>

      <h3 className="social-subtitle">Your Friends</h3>
      <div className="social-grid">
        {friends.map((f) => (
          <article key={f.id} className="kino-panel social-surface-card">
            <p className="post-author">{f.name}</p>
            <p className="social-muted">{f.email}</p>
          </article>
        ))}
      </div>

      <h3 className="social-subtitle">Friend Activity Highlights</h3>
      <div className="post-list">
        {friendHighlights.map((e) => <ActivityCard key={e.id} event={e} />)}
      </div>
      <div className="social-toolbar">
        <Link className="btn-ghost" to="/activity">Open Full Activity</Link>
        <Link className="btn-ghost" to="/communities">Explore Communities</Link>
      </div>
    </section>
  )
}
