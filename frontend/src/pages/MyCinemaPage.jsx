import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import MovieCard from '../components/MovieCard'
import { Card } from '../components/ui/card'
import { profileApi, recommendationApi } from '../services/api'
import '../components/Profile.css'

const TABS = ['overview', 'watchlist', 'favorites', 'watched', 'reviews', 'recommendations']
const EMPTY_LIBRARY = { watched: [], watchlist: [], favorites: [], reviews: [] }

const TAB_LABEL = {
  overview: 'Overview',
  watchlist: 'Watchlist',
  favorites: 'Favorites',
  watched: 'Watched',
  reviews: 'Reviews',
  recommendations: 'Recommendations',
}

const STAT_LABEL = {
  watchlist: 'Watchlist',
  favorites: 'Favorites',
  watched: 'Watched',
  reviews: 'Reviews',
  recommendations: 'Recommendations',
}

export default function MyCinemaPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initial = searchParams.get('tab')
  const [tab, setTab] = useState(TABS.includes(initial) ? initial : 'overview')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [library, setLibrary] = useState(EMPTY_LIBRARY)
  const [recommendations, setRecommendations] = useState([])
  const [recommendationError, setRecommendationError] = useState('')
  const [updatingRecommendationId, setUpdatingRecommendationId] = useState(null)

  useEffect(() => {
    setSearchParams({ tab })
  }, [tab, setSearchParams])

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      setError('')
      setRecommendationError('')
      try {
        const [profileResult, inboxResult] = await Promise.allSettled([
          profileApi.me(),
          recommendationApi.inbox(),
        ])

        if (profileResult.status !== 'fulfilled') {
          throw new Error('profile-load-failed')
        }

        setLibrary(profileResult.value.library || EMPTY_LIBRARY)

        if (inboxResult.status === 'fulfilled') {
          setRecommendations(inboxResult.value.items || [])
        } else {
          setRecommendations([])
          setRecommendationError('Recommendations are unavailable right now.')
        }
      } catch {
        setError('Failed to load your cinema data.')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const active = useMemo(() => library[tab] || [], [library, tab])

  const stats = useMemo(() => ({
    watchlist: library.watchlist.length,
    favorites: library.favorites.length,
    watched: library.watched.length,
    reviews: library.reviews.length,
    recommendations: recommendations.length,
  }), [library, recommendations])

  const overviewCards = useMemo(() => ([
    { key: 'watchlist', items: library.watchlist.slice(0, 4) },
    { key: 'favorites', items: library.favorites.slice(0, 4) },
    { key: 'watched', items: library.watched.slice(0, 4) },
  ]), [library])

  const updateRecommendation = async (id, status) => {
    setUpdatingRecommendationId(id)
    setRecommendationError('')
    try {
      const updated = await recommendationApi.update(id, { status })
      setRecommendations((prev) => prev.map((item) => (item.id === id ? { ...item, ...updated } : item)))
    } catch {
      setRecommendationError('Could not update recommendation status.')
    } finally {
      setUpdatingRecommendationId(null)
    }
  }

  return (
    <div className="profile-page">
      <Card className="kino-panel library-card my-cinema-card">
        <div className="library-head">
          <h2>My Cinema</h2>
          <div className="library-tabs">
            {TABS.map((t) => (
              <button key={t} type="button" className={t === tab ? 'active' : ''} onClick={() => setTab(t)}>
                {TAB_LABEL[t]}
              </button>
            ))}
          </div>
        </div>

        {loading && <div className="empty-box">Loading your cinema...</div>}
        {error && !loading && <div className="empty-box">{error}</div>}

        {!loading && !error && tab === 'overview' && (
          <div className="my-cinema-overview">
            <section className="my-cinema-stats">
              {Object.entries(stats).map(([key, value]) => (
                <article key={key} className="my-cinema-stat">
                  <p className="my-cinema-stat-value">{value}</p>
                  <p className="my-cinema-stat-label">{STAT_LABEL[key]}</p>
                </article>
              ))}
            </section>

            <section className="my-cinema-overview-grid">
              {overviewCards.map(({ key, items }) => (
                <article key={key} className="my-cinema-overview-panel">
                  <div className="my-cinema-overview-head">
                    <h3>{STAT_LABEL[key]}</h3>
                    <button type="button" className="btn-ghost" onClick={() => setTab(key)}>Open</button>
                  </div>
                  {items.length > 0 ? (
                    <div className="movie-grid profile-movie-grid">
                      {items.map((movie) => <MovieCard key={`overview-${key}-${movie.id}`} movie={movie} />)}
                    </div>
                  ) : (
                    <div className="empty-box">No items yet.</div>
                  )}
                </article>
              ))}

              <article className="my-cinema-overview-panel">
                <div className="my-cinema-overview-head">
                  <h3>Recent Reviews</h3>
                  <button type="button" className="btn-ghost" onClick={() => setTab('reviews')}>Open</button>
                </div>
                {library.reviews.length > 0 ? (
                  <div className="reviews-list">
                    {library.reviews.slice(0, 3).map((review) => (
                      <article key={`overview-review-${review.id}`} className="review-item">
                        <h3>{review.movie?.title || 'Unknown movie'}</h3>
                        <p className="muted">Rating: {review.rating}/5</p>
                        <p>{review.content}</p>
                      </article>
                    ))}
                  </div>
                ) : (
                  <div className="empty-box">No reviews yet.</div>
                )}
              </article>
            </section>
          </div>
        )}

        {!loading && !error && ['watchlist', 'favorites', 'watched'].includes(tab) && active.length > 0 && (
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

        {!loading && !error && tab === 'recommendations' && (
          <div className="my-cinema-recommendations">
            {recommendationError && <p className="err">{recommendationError}</p>}

            {recommendations.length > 0 ? (
              <div className="reviews-list">
                {recommendations.map((item) => (
                  <article key={item.id} className="review-item">
                    <h3>{item.movie?.title || 'Movie recommendation'}</h3>
                    <p className="muted">From: {item.from_user?.name || 'Member'}</p>
                    <p className="muted">Status: {item.status || 'pending'}</p>
                    {item.note && <p>{item.note}</p>}
                    <div className="community-actions">
                      <button
                        type="button"
                        className="btn-ghost"
                        onClick={() => updateRecommendation(item.id, 'seen')}
                        disabled={updatingRecommendationId === item.id}
                      >
                        Mark Seen
                      </button>
                      <button
                        type="button"
                        className="btn-ghost"
                        onClick={() => updateRecommendation(item.id, 'accepted')}
                        disabled={updatingRecommendationId === item.id}
                      >
                        Accept
                      </button>
                      <button
                        type="button"
                        className="btn-ghost"
                        onClick={() => updateRecommendation(item.id, 'dismissed')}
                        disabled={updatingRecommendationId === item.id}
                      >
                        Dismiss
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="empty-box">No recommendations yet.</div>
            )}
          </div>
        )}

        {!loading && !error && ['watchlist', 'favorites', 'watched', 'reviews'].includes(tab) && active.length === 0 && (
          <div className="empty-box">No items in this section yet.</div>
        )}
      </Card>
    </div>
  )
}
