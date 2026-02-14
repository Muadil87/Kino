import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './MovieCard.css'

export default function MovieCard({ movie }) {
  const [isHovered, setIsHovered] = useState(false)

  const tmdbBase = 'https://image.tmdb.org/t/p/w500'
  const poster = movie.poster_path || movie.posterUrl
  const imageUrl = poster
    ? (String(poster).startsWith('http') ? poster : `${tmdbBase}${poster}`)
    : 'https://via.placeholder.com/500x750?text=No+Image'

  const releaseYear = movie.release_date ? movie.release_date.split('-')[0] : 'N/A'
  const rating = typeof movie.vote_average === 'number' ? movie.vote_average.toFixed(1) : (movie.rating ?? 'N/A')

  return (
    <div
      className="movie-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Poster Image */}
      <div className="movie-poster">
        <Link to={`/movie/${movie.id}`} className="poster-link">
          <img
            src={imageUrl} 
            alt={movie.title}
            className="poster-image"
            loading="lazy"
          />
        </Link>
        
        {/* Overlay */}
        <div className={`movie-overlay ${isHovered ? 'visible' : ''}`} />
      </div>

      {/* Content */}
      <div className="movie-content">
        <div className="movie-header">
          <div className="movie-info">
            <Link to={`/movie/${movie.id}`} className="movie-title-link">
              <h3 className="movie-title">{movie.title}</h3>
            </Link>
            <p className="movie-meta">
              {releaseYear}
            </p>
          </div>
          <div className="movie-rating">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="12 2 15.09 10.26 23.77 11.27 17.88 17.14 19.54 25.98 12 21.77 4.46 25.98 6.12 17.14 0.23 11.27 8.91 10.26"></polygon>
            </svg>
            <span>{rating}</span>
          </div>
        </div>

        {/* Description */}
        <p className="movie-description">
          {movie.overview ? (movie.overview.length > 100 ? movie.overview.substring(0, 100) + '...' : movie.overview) : 'No description available.'}
        </p>

        {/* Action Button */}
        <div className={`card-actions ${isHovered ? 'visible' : ''}`}>
           <Link to={`/movie/${movie.id}`} className="watch-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21"></polygon>
            </svg>
            Details
          </Link>
        </div>
      </div>
    </div>
  )
}
