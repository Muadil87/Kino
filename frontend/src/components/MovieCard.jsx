import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { tmdbImage } from '../utils/image'
import { Button } from './ui/button'
import './MovieCard.css'

export default function MovieCard({ movie, onRemove, onMarkWatched, onClick }) {
  const [isHovered, setIsHovered] = useState(false)

  const imagePath = movie.poster_path || movie.posterUrl || movie.backdrop_path || movie.backdropUrl
  const imageUrl = tmdbImage(imagePath, 'w500')
  const year = movie.release_date ? movie.release_date.slice(0, 4) : null
  const rating = typeof movie.vote_average === 'number' ? movie.vote_average.toFixed(1) : null

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
              e.target.onerror = null
              e.target.src = 'https://via.placeholder.com/500x750?text=No+Image'
            }}
          />

          {(onRemove || onMarkWatched) && (
            <div className={`movie-actions-overlay ${isHovered ? 'visible' : ''}`}>
              {onMarkWatched && (
                <Button
                  variant="unstyled"
                  size="none"
                  className="action-btn watched-btn"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    onMarkWatched(movie)
                  }}
                  title="Mark as Watched"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                </Button>
              )}
              {onRemove && (
                <Button
                  variant="unstyled"
                  size="none"
                  className="action-btn remove-btn"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    onRemove(movie)
                  }}
                  title="Remove from List"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                </Button>
              )}
            </div>
          )}
        </div>

        <div className="movie-text-overlay">
          <div className="movie-info-container">
            <h3 className="movie-title">{movie.title}</h3>
            <div className="movie-meta-row">
              {year && <span className="movie-meta-chip">{year}</span>}
              {rating && <span className="movie-meta-chip">? {rating}</span>}
              {movie.dateWatched && <span className="movie-meta-chip subtle">Watched</span>}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
