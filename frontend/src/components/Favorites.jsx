import React from 'react'
import MovieCard from './MovieCard'
import { Link } from 'react-router-dom'
import './Favorites.css'

export default function Favorites({ movies }) {
  return (
    <section className="favorites-section">
      <div className="section-header favorites-header">
        <div>
          <p className="kino-overline">Your Library</p>
          <h2 className="section-title">Your Favorites</h2>
        </div>
        <p className="section-subtitle">Your personal collection of beloved films.</p>
      </div>

      {(!movies || movies.length === 0) && (
        <div className="empty-state">
          <h3>No favorites yet</h3>
          <p>Start building your collection by clicking the heart icon on movies you love.</p>
          <Link to="/dashboard" className="favorites-empty-btn">
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
