import React from 'react'
import './HeroSection.css'

export default function HeroSection({ movie }) {
  return (
    <div className="hero-section" style={{ backgroundImage: `url(${movie.poster_path})` }}>
      {/* Gradient Overlays */}
      <div className="hero-overlay-left"></div>
      <div className="hero-overlay-bottom"></div>

      {/* Content */}
      <div className="hero-content">
        <div className="hero-inner">
          {/* Genre Badge */}
          <div className="genre-badge">
            Featured • {movie.genre}
          </div>

          {/* Title */}
          <h1 className="hero-title">{movie.title}</h1>

          {/* Metadata */}
          <div className="hero-metadata">
            <div className="meta-item">
              <span>{movie.release_date}</span>
            </div>
            <div className="meta-item rating">
              <span className="rating-value">{movie.rating}</span>
              <span className="rating-label">/10</span>
            </div>
          </div>

          {/* Description */}
          <p className="hero-description">
            {movie.description}. Experience the magic of cinema with our curated selection of extraordinary films.
          </p>

          {/* CTA Buttons */}
          <div className="hero-buttons">
            <button className="btn btn-primary">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21"></polygon>
              </svg>
              Play Now
            </button>
            <button className="btn btn-secondary">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
              More Info
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
