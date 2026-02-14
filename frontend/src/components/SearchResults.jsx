import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { searchMovies } from '../services/tmdb'
import MovieCard from './MovieCard'

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
    <section className="section">
      <div className="section-header">
        <div>
          <h2 className="section-title">Search</h2>
          <div className="title-underline"></div>
        </div>
      </div>

      {loading && <div>Searching…</div>}
      {!loading && results.length === 0 && <div>No results for “{query}”.</div>}

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
