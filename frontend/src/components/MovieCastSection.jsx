import React from 'react'
import './MovieCastSection.css'

export function MovieCastSection({ cast, isLoading }) {
  if (isLoading && !cast) return <div className="loading-message">Loading cast...</div>
  if (!cast || cast.length === 0) return null

  // Take top 12 cast members
  const displayCast = cast.slice(0, 12)

  return (
    <div className="cast-section">
      <h2 className="section-title">Top Cast</h2>
      <div className="cast-grid">
        {displayCast.map(p => {
          const profilePath = p.profile_path 
            ? `https://image.tmdb.org/t/p/w185${p.profile_path}` 
            : 'https://via.placeholder.com/185x278?text=No+Image'
            
          return (
            <div key={p.cast_id || p.credit_id} className="cast-card">
              <img 
                src={profilePath} 
                alt={p.name} 
                className="cast-image" 
                loading="lazy"
              />
              <div className="cast-info">
                <span className="cast-name">{p.name}</span>
                <span className="cast-character">{p.character}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
