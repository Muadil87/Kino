import { useEffect, useMemo, useState } from 'react'
import MovieCard from './MovieCard'
import SkeletonCard from './SkeletonCard'
import { discoverMovies, getGenres, getNowPlayingMovies, getPopularMovies, getTrendingMovies, getUpcomingMovies } from '../services/tmdb'
import CinematicSection from './CinematicSection'
import { tmdbImage } from '../utils/image'
import { Button } from './ui/button'
import { Select } from './ui/select'
import './MoviesBrowse.css'

const SORT_OPTIONS = [
  { value: 'popularity.desc', label: 'Most Popular' },
  { value: 'vote_average.desc', label: 'Highest Rated' },
  { value: 'release_date.desc', label: 'Newest Releases' },
  { value: 'title.asc', label: 'Title A-Z' },
]

const ERA_OPTIONS = [
  { value: '', label: 'All Eras' },
  { value: '1990s', label: '1990s' },
  { value: '2000s', label: '2000s' },
  { value: '2010s', label: '2010s' },
  { value: '2020s', label: '2020s' },
  { value: 'classic', label: 'Classic Cinema (before 1980)' },
  { value: 'modern_classics', label: 'Modern Classics' },
  { value: 'new_releases', label: 'New Releases' },
]

const CATALOG_OPTIONS = [
  { value: 'all', label: 'All Movies' },
  { value: 'trending', label: 'Trending' },
  { value: 'popular', label: 'Popular' },
  { value: 'now_playing', label: 'Now Playing' },
  { value: 'upcoming', label: 'Upcoming' },
]

export default function MoviesBrowse() {
  const [genres, setGenres] = useState([])
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [filters, setFilters] = useState({
    category: 'all',
    query: '',
    sortBy: 'popularity.desc',
    genre: '',
    releaseEra: '',
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
        const hasAdvancedFilters = Boolean(filters.query || filters.genre || filters.releaseEra || filters.minRating)
        const useDiscover = filters.category === 'all' || hasAdvancedFilters
        const eraRanges = {
          '1990s': { from: '1990-01-01', to: '1999-12-31' },
          '2000s': { from: '2000-01-01', to: '2009-12-31' },
          '2010s': { from: '2010-01-01', to: '2019-12-31' },
          '2020s': { from: '2020-01-01', to: '2029-12-31' },
          classic: { from: undefined, to: '1979-12-31' },
          modern_classics: { from: '1980-01-01', to: '2014-12-31' },
          new_releases: { from: '2023-01-01', to: undefined },
        }
        const selectedEra = eraRanges[filters.releaseEra] || {}

        if (useDiscover) {
          const data = await discoverMovies({
            page,
            sortBy: filters.sortBy,
            withGenres: filters.genre || undefined,
            releaseDateGte: selectedEra.from,
            releaseDateLte: selectedEra.to,
            voteAverageGte: filters.minRating || undefined,
            query: filters.query || undefined,
          })
          setItems(data?.results || [])
          setTotalPages(Math.min(data?.total_pages || 1, 500))
        } else {
          let data = { results: [], total_pages: 1 }
          if (filters.category === 'trending') {
            const results = await getTrendingMovies()
            data = { results, total_pages: 1 }
          } else if (filters.category === 'popular') {
            data = await getPopularMovies(page)
          } else if (filters.category === 'now_playing') {
            data = await getNowPlayingMovies(page)
          } else if (filters.category === 'upcoming') {
            data = await getUpcomingMovies(page)
          }

          setItems(data?.results || [])
          setTotalPages(Math.min(data?.total_pages || 1, 500))
        }
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
        <div className="browse-hero-strip kino-panel">
          <img
            src={tmdbImage('/hZkgoQYus5vegHoetLkCJzb17zJ.jpg', 'w1280')}
            alt="Movies catalog backdrop"
            className="browse-hero-image"
            loading="lazy"
            onError={(e) => { e.target.style.display = 'none' }}
          />
          <div className="browse-hero-overlay" />
        </div>

        <div className="browse-category-tabs">
          {CATALOG_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`browse-pill ${filters.category === option.value ? 'active' : ''}`}
              onClick={() => updateFilter('category', option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="browse-filters kino-panel">
          <input
            type="search"
            className="browse-input"
            placeholder="Search a movie title..."
            value={filters.query}
            onChange={(e) => updateFilter('query', e.target.value)}
          />
          <Select
            value={filters.sortBy}
            onValueChange={(val) => updateFilter('sortBy', val)}
            options={SORT_OPTIONS}
          />
          <Select
            value={filters.genre}
            onValueChange={(val) => updateFilter('genre', val)}
            options={[{ value: '', label: 'All Genres' }, ...genres.map((g) => ({ value: String(g.id), label: g.name }))]}
          />
          <Select
            value={filters.releaseEra}
            onValueChange={(val) => updateFilter('releaseEra', val)}
            options={ERA_OPTIONS}
          />
          <Select
            value={filters.minRating}
            onValueChange={(val) => updateFilter('minRating', val)}
            options={[
              { value: '', label: 'Any Rating' },
              { value: '5', label: '5+' },
              { value: '6', label: '6+' },
              { value: '7', label: '7+' },
              { value: '8', label: '8+' },
            ]}
          />
          <Button
            variant="cinematic"
            className="browse-reset-btn"
            onClick={() => {
              setPage(1)
              setFilters({
                category: filters.category,
                query: '',
                sortBy: 'popularity.desc',
                genre: '',
                releaseEra: '',
                minRating: '',
              })
            }}
          >
            Reset
          </Button>
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
