import React, { useState } from 'react'
import './MovieCard.css'

export default function MovieCard({ movie }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className="movie-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Poster Image */}
      <div className="movie-poster">
        <img
          src={movie.poster_path}
          alt={movie.title}
          className="poster-image"
        />
        
        {/* Overlay */}
        <div className={`movie-overlay ${isHovered ? 'visible' : ''}`} />
      </div>

      {/* Content */}
      <div className="movie-content">
        <div className="movie-header">
          <div className="movie-info">
            <h3 className="movie-title">{movie.title}</h3>
            <p className="movie-meta">
              {movie.release_date} • {movie.genre}
            </p>
          </div>
          <div className="movie-rating">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="12 2 15.09 10.26 23.77 11.27 17.88 17.14 19.54 25.98 12 21.77 4.46 25.98 6.12 17.14 0.23 11.27 8.91 10.26"></polygon>
            </svg>
            <span>{movie.rating}</span>
          </div>
        </div>

        {/* Description */}
        <p className="movie-description">
          {movie.description}
        </p>

        {/* Action Button */}
        {isHovered && (
          <button className="watch-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21"></polygon>
            </svg>
            Watch Now
          </button>
        )}
      </div>
    </div>
  )
}
