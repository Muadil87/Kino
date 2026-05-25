import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { communityApi, recommendationApi, telegramApi } from '../services/api'
import CommunityPostComposer from '../components/CommunityPostComposer'
import CommunityPostList from '../components/CommunityPostList'
import ChallengeCard from '../components/ChallengeCard'
import RecommendationInbox from '../components/RecommendationInbox'
import ActivityLens from '../components/ActivityLens'
import '../components/Social.css'

export default function CommunityDetailPage() {
  const { slug } = useParams()
  const [community, setCommunity] = useState(null)
  const [members, setMembers] = useState([])
  const [posts, setPosts] = useState([])
  const [challenges, setChallenges] = useState([])
  const [inbox, setInbox] = useState([])
  const [leaderboard, setLeaderboard] = useState([])
  const [stats, setStats] = useState({})

  const [postsPage, setPostsPage] = useState(1)
  const [leaderboardPage, setLeaderboardPage] = useState(1)
  const [postsMeta, setPostsMeta] = useState({ currentPage: 1, lastPage: 1 })
  const [leaderboardMeta, setLeaderboardMeta] = useState({ currentPage: 1, lastPage: 1 })
  const [refreshKey, setRefreshKey] = useState(0)
  const [telegramCode, setTelegramCode] = useState('')
  const [telegramMessage, setTelegramMessage] = useState('')

  useEffect(() => {
    let ignore = false
    ;(async () => {
      const [c, m, p, ch, ib, lb, st] = await Promise.all([
        communityApi.get(slug),
        communityApi.members(slug, { page: 1, perPage: 10 }),
        communityApi.posts(slug, { page: postsPage, perPage: 8 }),
        communityApi.challenges(slug, { page: 1, perPage: 6 }),
        recommendationApi.inbox(),
        communityApi.leaderboard(slug, { page: leaderboardPage, perPage: 8 }),
        communityApi.stats(slug),
      ])
      if (ignore) return
      setCommunity(c)
      setMembers(m.items || [])
      setPosts(p.items || [])
      setChallenges(ch.items || [])
      setInbox(ib.items || [])
      setLeaderboard(lb.items || [])
      setStats(st || {})
      setPostsMeta(p.meta || { currentPage: 1, lastPage: 1 })
      setLeaderboardMeta(lb.meta || { currentPage: 1, lastPage: 1 })
    })()
    return () => {
      ignore = true
    }
  }, [slug, postsPage, leaderboardPage, refreshKey])

  if (!community) return <div className="social-page">Loading community...</div>

  const activeChallenges = challenges.filter((c) => c.status === 'active').length

  return (
    <section className="social-page">
      <div className="section-header">
        <div>
          <p className="kino-overline">KINO Community</p>
          <h1 className="section-title">{community.name}</h1>
        </div>
        <p className="section-subtitle">{community.description || 'No description yet.'}</p>
      </div>

      <div className="social-hero-strip kino-panel">
        <div>
          <p className="social-kpi-label">Members</p>
          <p className="social-kpi-value">{stats.members ?? members.length}</p>
        </div>
        <div>
          <p className="social-kpi-label">Total Watches</p>
          <p className="social-kpi-value">{stats.watched_count ?? 0}</p>
        </div>
        <div>
          <p className="social-kpi-label">Active Challenges</p>
          <p className="social-kpi-value">{activeChallenges}</p>
        </div>
      </div>

      <div className="kino-panel social-panel-dark social-progress-widget">
        <p className="post-author">Club Progress Snapshot</p>
        <p className="social-muted">
          This month your club logged <strong>{stats.watched_count ?? 0}</strong> watches across <strong>{stats.members ?? members.length}</strong> members.
        </p>
      </div>

      <div className="social-two-col">
        <div>
          <CommunityPostComposer onSubmit={(payload) => communityApi.createPost(slug, payload).then(() => setRefreshKey((v) => v + 1))} />
          <CommunityPostList posts={posts} />
          <div className="social-pager">
            <button className="btn-ghost" disabled={postsMeta.currentPage <= 1} onClick={() => setPostsPage((p) => Math.max(1, p - 1))}>Prev</button>
            <span className="social-page-label">Posts {postsMeta.currentPage}/{postsMeta.lastPage}</span>
            <button className="btn-ghost" disabled={postsMeta.currentPage >= postsMeta.lastPage} onClick={() => setPostsPage((p) => Math.min(postsMeta.lastPage, p + 1))}>Next</button>
          </div>
        </div>
        <aside className="social-side">
          <div className="kino-panel social-panel-dark">
            <p className="post-author">Members ({members.length})</p>
            {members.map((m) => <p key={m.id || `${m.user_id}`}>{m.user?.name || 'Member'}</p>)}
          </div>

          <div className="kino-panel social-panel-dark">
            <p className="post-author">Leaderboard</p>
            <div className="social-leaderboard-list">
              {leaderboard.map((row, idx) => (
                <div key={row.id} className="social-leaderboard-row">
                  <span className="social-rank">{(leaderboardMeta.currentPage - 1) * 8 + idx + 1}</span>
                  <span>{row.name}</span>
                  <span className="social-score">{row.watched_count}</span>
                </div>
              ))}
            </div>
            <div className="social-pager social-pager-tight">
              <button className="btn-ghost" disabled={leaderboardMeta.currentPage <= 1} onClick={() => setLeaderboardPage((p) => Math.max(1, p - 1))}>Prev</button>
              <span className="social-page-label">{leaderboardMeta.currentPage}/{leaderboardMeta.lastPage}</span>
              <button className="btn-ghost" disabled={leaderboardMeta.currentPage >= leaderboardMeta.lastPage} onClick={() => setLeaderboardPage((p) => Math.min(leaderboardMeta.lastPage, p + 1))}>Next</button>
            </div>
          </div>

          <div className="kino-panel social-panel-dark">
            <p className="post-author">Challenges</p>
            {challenges.length ? challenges.map((c) => <ChallengeCard key={c.id} challenge={c} />) : <p>No active challenges.</p>}
          </div>

          <div className="kino-panel social-panel-dark">
            <p className="post-author">Community Activity</p>
            <ActivityLens mode="community" sourceContext={slug} pageSize={8} />
          </div>

          <div className="kino-panel social-panel-dark telegram-card">
            <p className="post-author">Telegram Bridge (Optional)</p>
            <p className="social-muted">Use your community `/link CODE` flow in Telegram, then paste the confirmed code below.</p>
            <div className="telegram-confirm-row">
              <input
                placeholder="Confirmed group code"
                value={telegramCode}
                onChange={(e) => setTelegramCode(e.target.value)}
              />
              <button
                className="btn-ghost"
                onClick={async () => {
                  if (!telegramCode.trim()) return
                  try {
                    await telegramApi.linkCommunityGroup(slug, telegramCode.trim())
                    setTelegramMessage('Telegram group linked to this community.')
                    setTelegramCode('')
                  } catch {
                    setTelegramMessage('Failed to link. Confirm the code in Telegram first.')
                  }
                }}
              >
                Link Group
              </button>
            </div>
            <button
              className="btn-ghost"
              onClick={async () => {
                try {
                  await telegramApi.unlinkCommunityGroup(slug)
                  setTelegramMessage('Community Telegram link removed.')
                } catch {
                  setTelegramMessage('Could not unlink Telegram bridge.')
                }
              }}
            >
              Unlink Group
            </button>
            {telegramMessage && <p className="social-muted">{telegramMessage}</p>}
          </div>
        </aside>
      </div>

      <div className="section-header social-mini-header">
        <h2 className="section-title">Recommendation Inbox</h2>
      </div>
      <RecommendationInbox items={inbox} onUpdate={(id, status) => recommendationApi.update(id, { status }).then(() => setRefreshKey((v) => v + 1))} />
    </section>
  )
}
