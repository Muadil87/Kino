import React from 'react'
import MovieCard from './MovieCard'
import { Link } from 'react-router-dom'

export default function Favorites({ movies }) {
  return (
    <section className="section favorites-section">
      <div className="favorites-header">
        <h2 className="favorites-title">Your Favorites</h2>
        <p className="favorites-subtitle">Your personal collection of beloved films</p>
      </div>

      {(!movies || movies.length === 0) && (
        <div className="empty-state">
          <h3>No favorites yet</h3>
          <p>Start building your collection by clicking the heart icon on movies you love.</p>
          <Link to="/dashboard" className="btn-primary favorites-empty-btn">
            Explore Movies
          </Link>
        </div>
      )}

      {movies && movies.length > 0 && (
        <div className="movie-grid">
          {movies.map(m => (
            <MovieCard key={m.id} movie={m} />
          ))}
        </div>
      )}
    </section>
  )
}
