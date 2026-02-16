import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { searchMovies } from '../services/tmdb'
import MovieCard from './MovieCard'
import SkeletonCard from './SkeletonCard'

export default function SearchResults() {
  const [params] = useSearchParams()
  const query = params.get('q') || ''
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const run = async () => {
      if (!query.trim()) {
        setResults([])
        return
      }
      setLoading(true)
      try {
        const r = await searchMovies(query.trim())
        setResults(r || [])
      } catch (e) {
        console.error('Search failed:', e)
        setResults([])
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [query])

  return (
    <section className="section search-results-section">
      <div className="section-header">
        <h2 className="section-title">Search Results</h2>
        {loading ? (
          <div className="skeleton" style={{ width: '200px', height: '1.2em', marginTop: '0.5rem' }}></div>
        ) : (
          <p className="section-subtitle">Found {results.length} matches for "{query}"</p>
        )}
      </div>

      {loading && (
        <div className="movie-grid">
          {[...Array(8)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {!loading && results.length === 0 && query && (
        <div className="empty-state">
          <h3>No matches found</h3>
          <p>We couldn't find any movies matching "{query}". Try checking your spelling or search for something else.</p>
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="movie-grid">
          {results.map(m => (
            <MovieCard key={m.id} movie={m} />
          ))}
        </div>
      )}
    </section>
  )
}
