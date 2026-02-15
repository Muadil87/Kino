import React from 'react'
import MovieCard from './MovieCard'
import { Link } from 'react-router-dom'

export default function Favorites({ movies }) {
  return (
    <section className="section favorites-section">
      <div className="section-header">
        <div>
          <h2 className="section-title">Your Favorites</h2>
          <div className="title-underline"></div>
        </div>
      </div>

      {(!movies || movies.length === 0) && (
        <div className="empty-state">
          <h3>No favorites yet</h3>
          <p>Start building your collection by clicking the heart icon on movies you love.</p>
          <Link to="/dashboard" className="btn-primary" style={{marginTop: '1.5rem', display: 'inline-flex', textDecoration: 'none'}}>
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
