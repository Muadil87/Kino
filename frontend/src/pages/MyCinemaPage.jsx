import { useMemo, useState } from 'react'
import MovieCard from '../components/MovieCard'
import { getSimilarMovies } from '../services/tmdb'
import { useEffect } from 'react'
import Icon from '../components/ui/Icon'
import '../components/Watchlist.css'

export default function MyCinemaPage({ watchlist, favorites, history, onRemoveFromWatchlist, onRemoveFromFavorites, onRemoveFromHistory, onMoveToHistory, initialTab = 'watchlist' }) {
  const [tab, setTab] = useState(initialTab)
  const [recommendations, setRecommendations] = useState([])

  const currentItems = useMemo(() => {
    if (tab === 'favorites') return favorites || []
    if (tab === 'history') return history || []
    return watchlist || []
  }, [tab, watchlist, favorites, history])

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!watchlist?.length) return setRecommendations([])
      const anchor = watchlist[watchlist.length - 1]
      if (!anchor?.id) return setRecommendations([])
      try {
        const similar = await getSimilarMovies(anchor.id)
        setRecommendations(
          (similar || []).filter(
            (rec) => !(watchlist || []).some((m) => m.id === rec.id) && !(history || []).some((h) => h.id === rec.id)
          ).slice(0, 8)
        )
      } catch {
        setRecommendations([])
      }
    }
    fetchRecommendations()
  }, [watchlist, history])

  const handleRemove = (movie) => {
    if (tab === 'favorites') return onRemoveFromFavorites?.(movie)
    if (tab === 'history') return onRemoveFromHistory?.(movie)
    return onRemoveFromWatchlist?.(movie)
  }

  return (
    <div className="watchlist-page">
      <div className="watchlist-header section-header">
        <div>
          <p className="kino-overline">Your Cinema</p>
          <h1 className="section-title">My Cinema</h1>
        </div>
        <div className="tabs-container">
          <button className={`tab-btn ${tab === 'watchlist' ? 'active' : ''}`} onClick={() => setTab('watchlist')}>
            <Icon name="watchlist" size={16} /> Watchlist <span className="count">({(watchlist || []).length})</span>
          </button>
          <button className={`tab-btn ${tab === 'favorites' ? 'active' : ''}`} onClick={() => setTab('favorites')}>
            <Icon name="favorites" size={16} /> Favorites <span className="count">({(favorites || []).length})</span>
          </button>
          <button className={`tab-btn ${tab === 'history' ? 'active' : ''}`} onClick={() => setTab('history')}>
            <Icon name="history" size={16} /> History <span className="count">({(history || []).length})</span>
          </button>
        </div>
      </div>

      <div className="watchlist-content">
        {currentItems.length === 0 ? (
          <div className="empty-state">
            <h3>No movies in this section yet</h3>
            <p>Use movie actions to build your personal cinematic library.</p>
          </div>
        ) : (
          <div className="movie-grid">
            {currentItems.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onRemove={handleRemove}
                onMarkWatched={tab === 'watchlist' ? onMoveToHistory : null}
              />
            ))}
          </div>
        )}
      </div>

      <div className="watchlist-content recommendations-section">
        <div className="section-header">
          <div>
            <p className="kino-overline"><span className="overline-icon"><Icon name="ai" size={16} tone="gold" /></span>Personalized Discovery</p>
            <h2 className="section-title">From Your Circle</h2>
          </div>
          <p className="section-subtitle">Suggestions based on your recent library actions.</p>
        </div>
        {recommendations.length > 0 ? (
          <div className="movie-grid compact">
            {recommendations.map((movie) => <MovieCard key={movie.id} movie={movie} />)}
          </div>
        ) : (
          <div className="empty-state recommendations-empty"><p>Keep logging and saving movies to unlock richer picks.</p></div>
        )}
      </div>
    </div>
  )
}
