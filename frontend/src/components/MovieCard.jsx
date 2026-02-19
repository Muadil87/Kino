import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { tmdbImage } from '../utils/image'
import './MovieCard.css'

export default function MovieCard({ movie, onRemove, onMarkWatched, onClick }) {
  const [isHovered, setIsHovered] = useState(false)

  // Use backdrop_path instead of poster_path for landscape cards
  const imagePath = movie.backdrop_path || movie.backdropUrl || movie.poster_path || movie.posterUrl
  const imageUrl = tmdbImage(imagePath, 'w300') // Optimized size for grid cards

  return (
    <Link 
      to={`/movie/${movie.id}`} 
      className="movie-card-link"
      onClick={(e) => {
        if (onClick) {
          e.preventDefault()
          onClick(movie)
        }
      }}
    >
      <div
        className="movie-card"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="movie-image-wrapper">
          <img
            src={imageUrl} 
            alt={movie.title}
            className="movie-backdrop"
            loading="lazy"
            onError={(e) => {
              e.target.onerror = null; 
              e.target.src = 'https://via.placeholder.com/500x281?text=No+Image';
            }}
          />
          
          {/* Quick Actions Overlay - Only shows if handlers are provided */}
          {(onRemove || onMarkWatched) && (
            <div className={`movie-actions-overlay ${isHovered ? 'visible' : ''}`}>
              {onMarkWatched && (
                <button 
                  className="action-btn watched-btn" 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onMarkWatched(movie);
                  }}
                  title="Mark as Watched"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                </button>
              )}
              {onRemove && (
                <button 
                  className="action-btn remove-btn" 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onRemove(movie);
                  }}
                  title="Remove from List"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                </button>
              )}
            </div>
          )}
        </div>

        <div className="movie-text-overlay">
          <div className="movie-info-container">
            <h3 className="movie-title">{movie.title}</h3>
            {movie.dateWatched && (
              <div className="watched-date">Watched: {movie.dateWatched}</div>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
