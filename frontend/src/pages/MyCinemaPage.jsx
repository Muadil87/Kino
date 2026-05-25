import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import MovieCard from '../components/MovieCard'
import { Card } from '../components/ui/card'
import { profileApi } from '../services/api'
import '../components/Profile.css'

const TABS = ['watched', 'watchlist', 'favorites', 'reviews']

export default function MyCinemaPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initial = searchParams.get('tab')
  const [tab, setTab] = useState(TABS.includes(initial) ? initial : 'watched')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [library, setLibrary] = useState({ watched: [], watchlist: [], favorites: [], reviews: [] })

  useEffect(() => {
    setSearchParams({ tab })
  }, [tab, setSearchParams])

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      setError('')
      try {
        const data = await profileApi.me()
        setLibrary(data.library || { watched: [], watchlist: [], favorites: [], reviews: [] })
      } catch {
        setError('Failed to load your library.')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const active = useMemo(() => library[tab] || [], [library, tab])

  return (
    <div className="profile-page">
      <Card className="kino-panel library-card">
        <div className="library-head">
          <h2>My Library</h2>
          <div className="library-tabs">
            {TABS.map((t) => (
              <button key={t} type="button" className={t === tab ? 'active' : ''} onClick={() => setTab(t)}>
                {t[0].toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {loading && <div className="empty-box">Loading library...</div>}
        {error && !loading && <div className="empty-box">{error}</div>}

        {!loading && !error && tab !== 'reviews' && active.length > 0 && (
          <div className="movie-grid profile-movie-grid">
            {active.map((movie) => <MovieCard key={`${tab}-${movie.id}`} movie={movie} />)}
          </div>
        )}

        {!loading && !error && tab === 'reviews' && active.length > 0 && (
          <div className="reviews-list">
            {active.map((review) => (
              <article key={review.id} className="review-item">
                <h3>{review.movie?.title || 'Unknown movie'}</h3>
                <p className="muted">Rating: {review.rating}/5</p>
                <p>{review.content}</p>
              </article>
            ))}
          </div>
        )}

        {!loading && !error && active.length === 0 && <div className="empty-box">No items in this section yet.</div>}
      </Card>
    </div>
  )
}
