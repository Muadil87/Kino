import React from 'react'
import { useNavigate } from 'react-router-dom'
import MovieCard from './MovieCard'
import './SimilarMoviesSection.css'

export function SimilarMoviesSection({ movies, onMovieSelect }) {
  const navigate = useNavigate()

  if (!movies || movies.length === 0) return null

  const handleSelect = (movie) => {
    if (onMovieSelect) {
      onMovieSelect(movie.id)
    } else {
      navigate(`/movie/${movie.id}`)
      window.scrollTo(0, 0)
    }
  }

  return (
    <div className="similar-section">
      <h2 className="section-title">Similar Movies</h2>
      <div className="similar-grid">
        {movies.slice(0, 10).map(movie => (
          <div key={movie.id} className="similar-card-wrapper">
             <MovieCard movie={movie} onClick={handleSelect} />
          </div>
        ))}
      </div>
    </div>
  )
}
