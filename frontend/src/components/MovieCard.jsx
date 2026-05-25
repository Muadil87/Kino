import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { tmdbImage } from '../utils/image'
import { Button } from './ui/button'
import Icon from './ui/Icon'
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
                  <Icon name="watched" size={20} tone="gold" />
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
                  <Icon name="remove" size={20} tone="muted" />
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
              {rating && (
                <span className="movie-meta-chip rating-chip">
                  <Icon name="star" size={16} tone="gold" />
                  {rating}
                </span>
              )}
              {movie.dateWatched && <span className="movie-meta-chip subtle">Watched</span>}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
