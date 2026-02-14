import React from 'react'
import MovieCard from './MovieCard'

export default function Favorites({ movies }) {
  return (
    <section className="section">
      <div className="section-header">
        <div>
          <h2 className="section-title">Favorites</h2>
          <div className="title-underline"></div>
        </div>
      </div>
      {(!movies || movies.length === 0) && <div>No favorites yet.</div>}
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
