import React from 'react'
import Icon from './ui/Icon'

export function MovieHeroSection({ 
  movie, 
  director, 
  providers, 
  isLoading, 
  error, 
  onToggleFavorite, 
  onToggleWatchlist, 
  isFavorite, 
  isInWatchlist 
}) {
  if (error) return <div className="error-message">Error: {error}</div>
  if (isLoading && !movie) return <div className="loading-screen">Loading movie details...</div>
  if (!movie) return null

  const tmdbBase = 'https://image.tmdb.org/t/p/w780'
  const backdropBase = 'https://image.tmdb.org/t/p/w1280'
  
  const posterPath = movie.poster_path || movie.posterUrl
  const backdropPath = movie.backdrop_path || movie.backdropUrl
  
  const posterUrl = posterPath
    ? (String(posterPath).startsWith('http') ? posterPath : `${tmdbBase}${posterPath}`)
    : 'https://via.placeholder.com/780x1170?text=No+Image'
    
  const backdropUrl = backdropPath
    ? (String(backdropPath).startsWith('http') ? backdropPath : `${backdropBase}${backdropPath}`)
    : null

  const title = movie.title || 'Untitled'
  const year = movie.release_date ? movie.release_date.split('-')[0] : 'N/A'
  const rating = typeof movie.vote_average === 'number' ? movie.vote_average.toFixed(1) : (movie.rating ?? 'N/A')
  const overview = movie.overview || movie.description || 'No description available.'
  const runtime = movie.runtime ? `${movie.runtime}m` : 'N/A'
  const genres = Array.isArray(movie.genres) ? movie.genres.map(g => g.name).join(', ') : ''
  const tagline = movie.tagline || ''
  
  const isFav = typeof isFavorite === 'function' ? isFavorite(movie.id) : isFavorite
  const isWatch = typeof isInWatchlist === 'function' ? isInWatchlist(movie.id) : isInWatchlist

  return (
    <div className="detail-hero-wrapper">
      {backdropUrl && (
        <div className="detail-backdrop">
          <img src={backdropUrl} alt="" />
          <div className="detail-backdrop-overlay" />
        </div>
      )}
      
      <div className="detail-hero-content">
        {/* Left Column: Poster */}
        <div className="detail-poster-wrapper">
          <img 
            src={posterUrl} 
            alt={title} 
            className="detail-poster" 
            onError={(e) => {
              e.target.onerror = null
              e.target.src = 'https://via.placeholder.com/780x1170?text=No+Image'
            }}
          />
        </div>

        {/* Right Column: Info */}
        <div className="detail-info">
          <div>
            <h1 className="detail-title">{title}</h1>
            {tagline && <p className="detail-tagline">{tagline}</p>}
          </div>

          <div className="detail-meta-badges">
            <div className="meta-badge badge-year">{year}</div>
            <div className="meta-badge badge-rating">
              <Icon name="star" size={16} tone="gold" />
              {rating}
            </div>
            <div className="meta-badge badge-runtime">{runtime}</div>
          </div>

          <div className="detail-genres">{genres}</div>

          {overview && <p className="detail-overview">{overview}</p>}

          {director && (
            <div className="detail-crew">
              <span className="crew-label">Directed by</span>
              <span className="crew-name">{director.name}</span>
            </div>
          )}

          <div className="detail-actions">
            {onToggleWatchlist && (
              <button 
                className={`detail-action-btn detail-btn-primary ${isWatch ? 'active' : ''}`}
                onClick={() => onToggleWatchlist(movie)}
              >
                <Icon name="watchlist" size={16} tone={isWatch ? 'gold' : 'normal'} />
                {isWatch ? 'In Watchlist' : 'Add to Watchlist'}
              </button>
            )}
            
            {onToggleFavorite && (
              <button 
                className={`detail-btn-icon ${isFav ? 'active' : ''}`}
                onClick={() => onToggleFavorite(movie)}
                title={isFav ? "Remove from Favorites" : "Add to Favorites"}
              >
                <Icon name="favorites" size={24} tone={isFav ? 'gold' : 'normal'} />
              </button>
            )}
          </div>

          {providers && providers.length > 0 && (
            <div className="detail-providers">
              <span className="providers-label">Available on</span>
              <div className="providers-list">
                {providers.map(provider => (
                  <img 
                    key={provider.provider_id}
                    src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                    alt={provider.provider_name}
                    title={provider.provider_name}
                    className="provider-logo"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
