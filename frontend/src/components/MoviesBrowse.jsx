import { useEffect, useMemo, useState } from 'react'
import MovieCard from './MovieCard'
import SkeletonCard from './SkeletonCard'
import { discoverMovies, getGenres } from '../services/tmdb'
import CinematicSection from './CinematicSection'
import './MoviesBrowse.css'

const SORT_OPTIONS = [
  { value: 'popularity.desc', label: 'Most Popular' },
  { value: 'vote_average.desc', label: 'Highest Rated' },
  { value: 'release_date.desc', label: 'Newest Releases' },
  { value: 'title.asc', label: 'Title A-Z' },
]

export default function MoviesBrowse() {
  const [genres, setGenres] = useState([])
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [filters, setFilters] = useState({
    query: '',
    sortBy: 'popularity.desc',
    genre: '',
    year: '',
    minRating: '',
  })

  useEffect(() => {
    const loadGenres = async () => {
      try {
        const data = await getGenres()
        setGenres(data || [])
      } catch {
        setGenres([])
      }
    }
    loadGenres()
  }, [])

  useEffect(() => {
    const loadMovies = async () => {
      setLoading(true)
      setError('')
      try {
        const data = await discoverMovies({
          page,
          sortBy: filters.sortBy,
          withGenres: filters.genre || undefined,
          year: filters.year || undefined,
          voteAverageGte: filters.minRating || undefined,
          query: filters.query || undefined,
        })
        setItems(data?.results || [])
        setTotalPages(Math.min(data?.total_pages || 1, 500))
      } catch {
        setItems([])
        setTotalPages(1)
        setError('Could not load movies right now.')
      } finally {
        setLoading(false)
      }
    }
    loadMovies()
  }, [page, filters])

  const visiblePages = useMemo(() => {
    const from = Math.max(1, page - 2)
    const to = Math.min(totalPages, page + 2)
    return Array.from({ length: to - from + 1 }, (_, i) => from + i)
  }, [page, totalPages])

  const updateFilter = (key, value) => {
    setPage(1)
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <section className="movies-browse-page">
      <CinematicSection
        overline="Full Catalog"
        title="Browse Movies"
        subtitle="Discover the full TMDB catalog with focused filters and clean cinematic browsing."
      >
        <div className="browse-filters kino-panel">
          <input
            type="search"
            className="browse-input"
            placeholder="Search a movie title..."
            value={filters.query}
            onChange={(e) => updateFilter('query', e.target.value)}
          />
          <select className="browse-select" value={filters.sortBy} onChange={(e) => updateFilter('sortBy', e.target.value)}>
            {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <select className="browse-select" value={filters.genre} onChange={(e) => updateFilter('genre', e.target.value)}>
            <option value="">All Genres</option>
            {genres.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
          </select>
          <input
            type="number"
            className="browse-input browse-input-small"
            placeholder="Year"
            min="1900"
            max="2099"
            value={filters.year}
            onChange={(e) => updateFilter('year', e.target.value)}
          />
          <select className="browse-select" value={filters.minRating} onChange={(e) => updateFilter('minRating', e.target.value)}>
            <option value="">Any Rating</option>
            <option value="5">5+</option>
            <option value="6">6+</option>
            <option value="7">7+</option>
            <option value="8">8+</option>
          </select>
        </div>
      </CinematicSection>

      {error && <div className="browse-error">{error}</div>}

      <div className="movie-grid">
        {loading && [...Array(12)].map((_, i) => <SkeletonCard key={i} />)}
        {!loading && items.map((movie) => <MovieCard key={movie.id} movie={movie} />)}
      </div>

      <div className="pagination-row social-pager">
        <button className="btn-ghost page-btn" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
          Previous
        </button>
        {visiblePages.map((p) => (
          <button
            key={p}
            className={`btn-ghost page-btn ${p === page ? 'active' : ''}`}
            onClick={() => setPage(p)}
          >
            {p}
          </button>
        ))}
        <button className="btn-ghost page-btn" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
          Next
        </button>
      </div>
    </section>
  )
}
