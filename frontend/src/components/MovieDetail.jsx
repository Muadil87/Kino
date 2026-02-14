import React, { useMemo, useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getMovieDetails, getMovieCredits, getMovieVideos, getSimilarMovies, getMovieReviews } from '../services/tmdb'
import './MovieDetail.css'
import { compactMetricsStyles } from '../ui/layoutMetrics'

export default function MovieDetail({ movies, onToggleFavorite, onToggleWatchlist, isFavorite, isInWatchlist }) {
  const { id } = useParams()
  const movieId = Number(id)

  const initialMovie = useMemo(() => {
    return movies?.find(m => Number(m.id) === movieId)
  }, [movies, movieId])

  const [movie, setMovie] = useState(initialMovie)
  const [credits, setCredits] = useState(null)
  const [videos, setVideos] = useState([])
  const [similar, setSimilar] = useState([])
  const [reviews, setReviews] = useState([])
  const [expanded, setExpanded] = useState(false)
  const [userRating, setUserRating] = useState(() => {
    try { return Number(localStorage.getItem(`kino_rating_${movieId}`) || 0) } catch { return 0 }
  })
  const [favActive, setFavActive] = useState(false)
  const [wlActive, setWlActive] = useState(false)

  useEffect(() => {
    const load = async () => {
      if (movie) return
      try {
        const data = await getMovieDetails(movieId)
        setMovie(data)
      } catch (e) {
        console.error('Failed to load movie details', e)
      }
    }
    load()
  }, [movie, movieId])
  
  useEffect(() => {
    const run = async () => {
      try {
        const [c, v, s, r] = await Promise.all([
          getMovieCredits(movieId),
          getMovieVideos(movieId),
          getSimilarMovies(movieId),
          getMovieReviews(movieId)
        ])
        setCredits(c)
        setVideos(v || [])
        setSimilar(s || [])
        setReviews(r || [])
      } catch (e) {
        console.error('Ancillary fetch failed', e)
      }
    }
    run()
  }, [movieId])
  
  useEffect(() => {
    setFavActive(Boolean(isFavorite?.(movieId)))
    setWlActive(Boolean(isInWatchlist?.(movieId)))
  }, [isFavorite, isInWatchlist, movieId])
  
  const handleFav = () => {
    if (!movie) return
    onToggleFavorite?.(movie)
    setFavActive(prev => !prev)
  }
  
  const handleWatch = () => {
    if (!movie) return
    onToggleWatchlist?.(movie)
    setWlActive(prev => !prev)
  }
  
  const setRating = (value) => {
    setUserRating(value)
    try { localStorage.setItem(`kino_rating_${movieId}`, String(value)) } catch {}
  }

  const tmdbBase = 'https://image.tmdb.org/t/p/w780'
  const poster = movie?.poster_path || movie?.posterUrl
  const imageUrl = poster
    ? (String(poster).startsWith('http') ? poster : `${tmdbBase}${poster}`)
    : 'https://via.placeholder.com/780x1170?text=No+Image'
  const backdropUrl = movie?.backdrop_path ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}` : null

  const title = movie?.title || 'Untitled'
  const year = movie?.release_date ? movie.release_date.split('-')[0] : 'N/A'
  const rating = typeof movie?.vote_average === 'number' ? movie.vote_average.toFixed(1) : (movie?.rating ?? 'N/A')
  const overview = movie?.overview || movie?.description || 'No description available.'
  const runtime = movie?.runtime ? `${movie.runtime}m` : 'N/A'
  const genres = Array.isArray(movie?.genres) ? movie.genres.map(g => g.name).join(', ') : ''
  const votes = movie?.vote_count ?? null
  const lang = movie?.original_language?.toUpperCase() ?? ''
  const budget = movie?.budget ? `$${(movie.budget).toLocaleString()}` : 'N/A'
  const revenue = movie?.revenue ? `$${(movie.revenue).toLocaleString()}` : 'N/A'
  const trailer = videos.find(v => v.type === 'Trailer' && v.site === 'YouTube')
  const cast = credits?.cast?.slice(0, 20) || []
  const director = credits?.crew?.find(p => p.job === 'Director')
  
  const styles = compactMetricsStyles(typeof window !== 'undefined' ? window.innerWidth : 1024)

  return (
    <div className={`detail-page ${backdropUrl ? 'detail-with-backdrop' : ''}`} style={backdropUrl ? { backgroundImage: `url(${backdropUrl})` } : undefined}>
      <div className="detail-header">
        <Link to="/dashboard" className="breadcrumb-link">← Back</Link>
      </div>

      <div className="detail-hero">
        <div className="detail-media">
          <img src={imageUrl} alt={title} className="detail-poster" />
        </div>

        <div className="detail-content">
          <h1 className="detail-title">{title}</h1>
          <div className="detail-meta">
            <span className="detail-year">{year}</span>
            <span className="detail-rating">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="12 2 15.09 10.26 23.77 11.27 17.88 17.14 19.54 25.98 12 21.77 4.46 25.98 6.12 17.14 0.23 11.27 8.91 10.26"></polygon>
              </svg>
              {rating}
            </span>
            <span className="detail-runtime">{runtime}</span>
            {genres && <span className="detail-genres">{genres}</span>}
            {director && <span className="detail-director">Dir. {director.name}</span>}
          </div>

          <div className={`detail-overview ${expanded ? 'expanded' : ''}`}>
            <p>{overview}</p>
            {!expanded && <button className="btn btn-outline read-more" onClick={() => setExpanded(true)}>Read more</button>}
          </div>
          
          <div className="compact-metrics" style={styles.container}>
            <div className="metric-item" style={styles.item}>
              <span className="metric-label">Rating</span>
              <div className="metric-badge" style={styles.badge}>
                <svg viewBox="0 0 24 24" fill="currentColor" width={styles.icon.width} height={styles.icon.height} aria-hidden="true">
                  <path d="M12 2l3.09 8.26L23 11.27l-6.91 5.87L18.18 23 12 19.77 5.82 23l2.09-5.86L1 11.27l7.91-1.01L12 2z"/>
                </svg>
                <span className="metric-text">{rating}</span>
              </div>
            </div>
            <div className="metric-item" style={styles.item}>
              <span className="metric-label">Votes</span>
              <div className="metric-badge" style={styles.badge}>
                <svg viewBox="0 0 24 24" fill="currentColor" width={styles.icon.width} height={styles.icon.height} aria-hidden="true">
                  <path d="M3 3h18v4H3V3zm0 6h18v12H3V9zm4 3v2h10v-2H7z"/>
                </svg>
                <span className="metric-text">{votes ?? 'N/A'}</span>
              </div>
            </div>
            <div className="metric-item" style={styles.item}>
              <span className="metric-label">Language</span>
              <div className="metric-badge" style={styles.badge}>
                <svg viewBox="0 0 24 24" fill="currentColor" width={styles.icon.width} height={styles.icon.height} aria-hidden="true">
                  <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 110-16 8 8 0 010 16zm0-14c-3.866 0-7 3.134-7 7h14c0-3.866-3.134-7-7-7z"/>
                </svg>
                <span className="metric-text">{lang || 'N/A'}</span>
              </div>
            </div>
          </div>

          <div className="detail-actions">
            <button className={`btn ${favActive ? 'btn-primary' : 'btn-outline'}`} onClick={handleFav}>{favActive ? 'Favorited' : 'Mark Favorite'}</button>
            <button className={`btn ${wlActive ? 'btn-primary' : 'btn-outline'}`} onClick={handleWatch}>{wlActive ? 'In Watchlist' : 'Add to Watchlist'}</button>
            <div className="user-stars">
              {[1,2,3,4,5,6,7,8,9,10].map(val => (
                <button key={val} className={`star ${userRating >= val ? 'active' : ''}`} onClick={() => setRating(val)}>{val}</button>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {cast.length > 0 && (
        <div className="cast-section">
          <h2 className="cast-title">Cast</h2>
          <div className="cast-scroll">
            {cast.map(p => {
              const head = p.profile_path ? `https://image.tmdb.org/t/p/w185${p.profile_path}` : 'https://via.placeholder.com/185x278?text=No+Image'
              return (
                <div key={p.cast_id || p.credit_id} className="cast-card">
                  <img src={head} alt={p.name} className="cast-photo" />
                  <div className="cast-name">{p.name}</div>
                  <div className="cast-role">{p.character}</div>
                </div>
              )
            })}
          </div>
        </div>
      )}
      
      {trailer && (
        <div className="trailer-section">
          <h2 className="trailer-title">Trailer</h2>
          <div className="trailer-frame">
            <iframe
              src={`https://www.youtube.com/embed/${trailer.key}`}
              title="Trailer"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
      
      {reviews && reviews.length > 0 && (
        <div className="reviews-section">
          <h2 className="reviews-title">Reviews</h2>
          <div className="reviews-list">
            {reviews.slice(0, 5).map(rv => (
              <div key={rv.id} className="review-card">
                <div className="review-head">
                  <div className="review-user">@{rv.author}</div>
                  {rv.author_details?.rating !== undefined && <div className="review-rating">⭐ {rv.author_details.rating}/10</div>}
                </div>
                <div className="review-body">{rv.content.length > 240 ? rv.content.slice(0, 240) + '…' : rv.content}</div>
                <div className="review-date">{rv.created_at?.split('T')[0] || ''}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {similar && similar.length > 0 && (
        <div className="similar-section">
          <h2 className="similar-title">Similar</h2>
          <div className="similar-scroll">
            {similar.slice(0, 12).map(m => (
              <div key={m.id} className="similar-card">
                <Link to={`/movie/${m.id}`}>
                  <img src={m.poster_path ? `https://image.tmdb.org/t/p/w342${m.poster_path}` : 'https://via.placeholder.com/342x513?text=No+Image'} alt={m.title} />
                </Link>
                <div className="similar-name">{m.title}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
