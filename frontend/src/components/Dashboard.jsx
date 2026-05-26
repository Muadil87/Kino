import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import MovieCard from './MovieCard'
import SkeletonCard from './SkeletonCard'
import './Dashboard.css'

const TMDB_IMAGE = 'https://image.tmdb.org/t/p/'
const imageFrom = (path, size = 'w780') => (path ? `${TMDB_IMAGE}${size}${path}` : '')

const runtimeText = (movie) => {
  const base = 110 + ((movie?.id || 0) % 55)
  return `${Math.floor(base / 60)}h ${base % 60}m`
}

const MOCK_MOVIES = [
  { id: 693134, title: 'Dune: Part Two', release_date: '2024-02-27', vote_average: 8.4, overview: 'Paul Atreides unites with Chani and the Fremen while seeking revenge and destiny among the desert stars.', backdrop_path: '/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg', poster_path: '/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg' },
  { id: 157336, title: 'Interstellar', release_date: '2014-11-05', vote_average: 8.4, overview: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.', backdrop_path: '/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg', poster_path: '/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg' },
  { id: 27205, title: 'Inception', release_date: '2010-07-15', vote_average: 8.4, overview: 'A thief with the ability to enter dreams is given one last chance at redemption.', backdrop_path: '/s3TBrRGB1iav7gFOCNx3H31MoES.jpg', poster_path: '/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg' },
  { id: 155, title: 'The Dark Knight', release_date: '2008-07-16', vote_average: 8.5, overview: 'Batman faces the Joker, a criminal mastermind who wants to plunge Gotham into anarchy.', backdrop_path: '/hqkIcbrOHL86UncnHIsHVcVmzue.jpg', poster_path: '/qJ2tW6WMUDux911r6m7haRef0WH.jpg' },
  { id: 335984, title: 'Blade Runner 2049', release_date: '2017-10-04', vote_average: 7.6, overview: 'A young blade runner discovers a long-buried secret that could alter society forever.', backdrop_path: '/h9XlI4Y8xcQYz9t8fA0Rj44f6I6.jpg', poster_path: '/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg' },
  { id: 872585, title: 'Oppenheimer', release_date: '2023-07-19', vote_average: 8.1, overview: 'The story of J. Robert Oppenheimer and the creation of the atomic bomb.', backdrop_path: '/fm6KqXpk3M2HVveHwCrBSSBaO0V.jpg', poster_path: '/ptpr0kGAckfQkJeJIt8st5dglvd.jpg' },
  { id: 438631, title: 'Dune', release_date: '2021-09-15', vote_average: 7.8, overview: 'Paul Atreides leads nomadic tribes in a battle to control the desert planet Arrakis.', backdrop_path: '/iopYFB1b6Bh7FWZh3onQhph1sih.jpg', poster_path: '/d5NXSklXo0qyIYkgV94XAgMIckC.jpg' },
  { id: 278, title: 'The Shawshank Redemption', release_date: '1994-09-23', vote_average: 8.7, overview: 'Two imprisoned men bond over years and find solace through acts of common decency.', backdrop_path: '/zfbjgQE1uSd9wiPTX4VzsLi0rGG.jpg', poster_path: '/9cqNxx0GxF0bflZmeSMuL5tnGzr.jpg' },
]

const mergeWithMock = (movies = []) => {
  const byId = new Map((movies || []).map((m) => [Number(m.id), m]))
  for (const mock of MOCK_MOVIES) {
    if (!byId.has(mock.id)) byId.set(mock.id, mock)
  }
  return Array.from(byId.values())
}

const normalizeMovie = (movie, fallback) => ({
  id: Number(movie?.id ?? fallback?.id ?? 0),
  title: movie?.title || fallback?.title || 'Untitled',
  poster_path: movie?.poster_path || fallback?.poster_path || null,
  backdrop_path: movie?.backdrop_path || fallback?.backdrop_path || null,
  release_date: movie?.release_date || fallback?.release_date || null,
  vote_average: typeof movie?.vote_average === 'number' ? movie.vote_average : (fallback?.vote_average ?? 0),
  overview: movie?.overview || fallback?.overview || '',
})

function HeroBanner({ movie, onOpenMovie }) {
  if (!movie) return null
  const bg = imageFrom(movie.backdrop_path, 'original') || imageFrom(movie.poster_path, 'w780')

  return (
    <article className="streaming-hero" style={{ backgroundImage: `url(${bg})` }}>
      <div className="streaming-hero-overlay" />
      <div className="streaming-hero-content">
        <p className="streaming-overline">Now Playing</p>
        <h1>{movie.title}</h1>
        <p className="streaming-meta">{movie.release_date?.slice(0, 4) || '2026'} • {runtimeText(movie)} • Sci-Fi, Adventure • PG-13</p>
        <p className="streaming-description">
          {movie.overview || 'A cinematic journey through power, prophecy, and survival across a shifting desert world.'}
        </p>
        <div className="streaming-actions">
          <button type="button" className="streaming-btn streaming-btn-primary" onClick={() => onOpenMovie(movie.id)}>Open Movie</button>
          <button type="button" className="streaming-btn streaming-btn-ghost" onClick={() => onOpenMovie(movie.id)}>View Details</button>
        </div>
      </div>
    </article>
  )
}

function MediaRail({ title, items = [], tone = 'dark' }) {
  return (
    <section className="streaming-section">
      <header className="streaming-section-header">
        <h2>{title}</h2>
        <button type="button" className="streaming-view-all">View All</button>
      </header>
      <div className={`streaming-grid ${tone === 'warm' ? 'streaming-grid-warm' : ''}`}>
        {items.map((movie) => <MovieCard key={`${title}-${movie.id}`} movie={movie} />)}
      </div>
    </section>
  )
}

export default function Dashboard({ movies, history }) {
  const navigate = useNavigate()
  const source = useMemo(() => mergeWithMock(movies || []), [movies])
  const byId = useMemo(() => new Map(source.map((m) => [Number(m.id), m])), [source])

  const heroMovie = source[0]
  const continueWatching = useMemo(() => {
    const base = history?.length ? history : source
    return base.slice(0, 4).map((movie) => normalizeMovie(movie, byId.get(Number(movie?.id)) || source[0]))
  }, [history, source, byId])
  const trending = useMemo(() => source.slice(0, 6).map((movie) => normalizeMovie(movie, movie)), [source])
  const following = useMemo(() => source.slice(2, 6).map((movie) => normalizeMovie(movie, movie)), [source])
  const popular = useMemo(() => source.slice(0, 6).map((movie) => normalizeMovie(movie, movie)), [source])
  const openMovie = (id) => navigate(`/movies/${id}`)

  if (!source || source.length === 0) {
    return (
      <div className="streaming-home">
        <div className="movie-grid">{[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}</div>
      </div>
    )
  }

  return (
    <div className="streaming-home">
      <HeroBanner movie={heroMovie} onOpenMovie={openMovie} />
      <MediaRail title="Continue Watching" items={continueWatching} />
      <MediaRail title="Trending This Week" items={trending} tone="warm" />
      <MediaRail title="From People You Follow" items={following} />
      <MediaRail title="Popular on KINO" items={popular} />
    </div>
  )
}
