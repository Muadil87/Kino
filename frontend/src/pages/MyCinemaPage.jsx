import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import MovieCard from '../components/MovieCard'
import { Card } from '../components/ui/card'
import Icon from '../components/ui/Icon'
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

const STAT_ICON = {
  watchlist: 'watchlist',
  favorites: 'favorites',
  watched: 'eye',
  reviews: 'star',
  recommendations: 'collections',
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
    { key: 'watchlist', title: 'Continue Watching', actionLabel: 'Open', items: library.watchlist.slice(0, 2) },
    { key: 'favorites', title: 'Favorites', actionLabel: 'View all', items: library.favorites.slice(0, 2) },
  ]), [library])

  const activeTitle = TAB_LABEL[tab]

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
    <div className="profile-page-cinematic my-cinema-page">
      <section className="my-cinema-hero">
        <div className="my-cinema-hero-copy">
          <div className="my-cinema-title-group">
            <p className="my-cinema-kicker">Personal Library</p>
            <h1 className="my-cinema-title">My Cinema</h1>
            <p className="my-cinema-subtitle">
              Track your watchlist, favorites, reviews, and recommendations in one cinematic workspace.
            </p>
          </div>

          <div className="library-tabs my-cinema-tabs" role="tablist" aria-label="My Cinema sections">
            {TABS.map((t) => (
              <button
                key={t}
                type="button"
                className={t === tab ? 'active' : ''}
                onClick={() => setTab(t)}
                aria-pressed={t === tab}
              >
                {TAB_LABEL[t]}
              </button>
            ))}
          </div>
        </div>

        <div className="my-cinema-hero-visual" aria-hidden="true">
          <div className="my-cinema-hero-glow my-cinema-hero-glow-left" />
          <div className="my-cinema-hero-glow my-cinema-hero-glow-right" />
          <div className="my-cinema-light-beam my-cinema-light-beam-primary" />
          <div className="my-cinema-light-beam my-cinema-light-beam-secondary" />
          <div className="my-cinema-light-orb" />
          <div className="my-cinema-projector">
            <span className="my-cinema-projector-top" />
            <span className="my-cinema-projector-reel my-cinema-projector-reel-large" />
            <span className="my-cinema-projector-reel my-cinema-projector-reel-small" />
            <span className="my-cinema-projector-lens" />
            <span className="my-cinema-projector-body" />
            <span className="my-cinema-projector-stand" />
            <span className="my-cinema-projector-base" />
          </div>
        </div>
      </section>

      <Card className="kino-panel my-cinema-stats-shell">
        <section className="my-cinema-stats">
          {Object.entries(stats).map(([key, value]) => (
            <article key={key} className="my-cinema-stat">
              <span className="my-cinema-stat-icon">
                <Icon name={STAT_ICON[key]} size={24} tone="gold" />
              </span>
              <div className="my-cinema-stat-copy">
                <p className="my-cinema-stat-value">{value}</p>
                <p className="my-cinema-stat-label">{STAT_LABEL[key]}</p>
              </div>
            </article>
          ))}
        </section>
      </Card>

      {loading && <Card className="kino-panel my-cinema-card"><div className="empty-box">Loading your cinema...</div></Card>}
      {error && !loading && <Card className="kino-panel my-cinema-card"><div className="empty-box">{error}</div></Card>}

      {!loading && !error && tab === 'overview' && (
        <section className="my-cinema-showcase-grid">
          {overviewCards.map(({ key, title, actionLabel, items }) => (
            <Card key={key} className="kino-panel my-cinema-feature-card">
              <div className="my-cinema-feature-head">
                <h2>{title}</h2>
                <button type="button" className="my-cinema-inline-link" onClick={() => setTab(key)}>
                  {actionLabel}
                </button>
              </div>
              {items.length > 0 ? (
                <div className="movie-grid profile-movie-grid my-cinema-feature-grid">
                  {items.map((movie) => <MovieCard key={`overview-${key}-${movie.id}`} movie={movie} />)}
                </div>
              ) : (
                <div className="my-cinema-empty-state">
                  <span className="my-cinema-empty-icon"><Icon name={STAT_ICON[key]} size={28} tone="gold" /></span>
                  <div>
                    <h3>No {STAT_LABEL[key].toLowerCase()} yet.</h3>
                    <p>Start curating this shelf to build out your cinema.</p>
                  </div>
                </div>
              )}
            </Card>
          ))}

          <Card className="kino-panel my-cinema-feature-card">
            <div className="my-cinema-feature-head">
              <h2>Watched</h2>
              <button type="button" className="my-cinema-inline-link" onClick={() => setTab('watched')}>
                Open
              </button>
            </div>
            {library.watched.length > 0 ? (
              <div className="movie-grid profile-movie-grid my-cinema-feature-grid">
                {library.watched.slice(0, 2).map((movie) => <MovieCard key={`overview-watched-${movie.id}`} movie={movie} />)}
              </div>
            ) : (
              <div className="my-cinema-empty-state my-cinema-empty-state-wide">
                <span className="my-cinema-empty-icon"><Icon name="cinema" size={28} tone="gold" /></span>
                <div>
                  <h3>You haven&apos;t watched any movies yet.</h3>
                  <p>Start watching and track your journey.</p>
                </div>
                <Link to="/movies" className="my-cinema-empty-action">
                  Explore Movies
                </Link>
              </div>
            )}
          </Card>

          <Card className="kino-panel my-cinema-feature-card">
            <div className="my-cinema-feature-head">
              <h2>Recent Reviews</h2>
              <button type="button" className="my-cinema-inline-link" onClick={() => setTab('reviews')}>
                Open
              </button>
            </div>
            {library.reviews.length > 0 ? (
              <div className="reviews-list my-cinema-review-list">
                {library.reviews.slice(0, 2).map((review) => (
                  <article key={`overview-review-${review.id}`} className="review-item my-cinema-review-card">
                    <h3>{review.movie?.title || 'Unknown movie'}</h3>
                    <p className="muted">Rating: {review.rating}/5</p>
                    <p>{review.content}</p>
                  </article>
                ))}
              </div>
            ) : (
              <div className="my-cinema-empty-state my-cinema-empty-state-wide">
                <span className="my-cinema-empty-icon"><Icon name="collections" size={28} tone="gold" /></span>
                <div>
                  <h3>No reviews yet.</h3>
                  <p>Share your thoughts on movies you&apos;ve watched.</p>
                </div>
                <Link to="/movies" className="my-cinema-empty-action">
                  Write a Review
                </Link>
              </div>
            )}
          </Card>
        </section>
      )}

      {!loading && !error && ['watchlist', 'favorites', 'watched'].includes(tab) && (
        <Card className="kino-panel my-cinema-card">
          <div className="my-cinema-feature-head my-cinema-feature-head-standalone">
            <h2>{activeTitle}</h2>
            <span className="my-cinema-section-meta">{active.length} titles</span>
          </div>
          {active.length > 0 ? (
            <div className="movie-grid profile-movie-grid my-cinema-library-grid">
              {active.map((movie) => <MovieCard key={`${tab}-${movie.id}`} movie={movie} />)}
            </div>
          ) : (
            <div className="my-cinema-empty-state my-cinema-empty-state-wide">
              <span className="my-cinema-empty-icon"><Icon name={STAT_ICON[tab]} size={28} tone="gold" /></span>
              <div>
                <h3>No items in this section yet.</h3>
                <p>Explore more films and start building this collection.</p>
              </div>
              <Link to="/movies" className="my-cinema-empty-action">
                Explore Movies
              </Link>
            </div>
          )}
        </Card>
      )}

      {!loading && !error && tab === 'reviews' && (
        <Card className="kino-panel my-cinema-card">
          <div className="my-cinema-feature-head my-cinema-feature-head-standalone">
            <h2>Reviews</h2>
            <span className="my-cinema-section-meta">{active.length} entries</span>
          </div>
          {active.length > 0 ? (
            <div className="reviews-list my-cinema-review-list">
              {active.map((review) => (
                <article key={review.id} className="review-item my-cinema-review-card">
                  <h3>{review.movie?.title || 'Unknown movie'}</h3>
                  <p className="muted">Rating: {review.rating}/5</p>
                  <p>{review.content}</p>
                </article>
              ))}
            </div>
          ) : (
            <div className="my-cinema-empty-state my-cinema-empty-state-wide">
              <span className="my-cinema-empty-icon"><Icon name="collections" size={28} tone="gold" /></span>
              <div>
                <h3>No reviews yet.</h3>
                <p>Watch something memorable, then come back and review it.</p>
              </div>
              <Link to="/movies" className="my-cinema-empty-action">
                Browse Movies
              </Link>
            </div>
          )}
        </Card>
      )}

      {!loading && !error && tab === 'recommendations' && (
        <Card className="kino-panel my-cinema-card">
          <div className="my-cinema-feature-head my-cinema-feature-head-standalone">
            <h2>Recommendations</h2>
            <span className="my-cinema-section-meta">{recommendations.length} items</span>
          </div>
          <div className="my-cinema-recommendations">
            {recommendationError && <p className="err">{recommendationError}</p>}

            {recommendations.length > 0 ? (
              <div className="reviews-list my-cinema-review-list">
                {recommendations.map((item) => (
                  <article key={item.id} className="review-item my-cinema-review-card">
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
              <div className="my-cinema-empty-state my-cinema-empty-state-wide">
                <span className="my-cinema-empty-icon"><Icon name="collections" size={28} tone="gold" /></span>
                <div>
                  <h3>No recommendations yet.</h3>
                  <p>Recommendations from your network will appear here.</p>
                </div>
                <Link to="/activity" className="my-cinema-empty-action">
                  Open Activity
                </Link>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  )
}
