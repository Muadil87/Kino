import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ChevronRight, Star, Bookmark } from 'lucide-react'
import LandingHero from './LandingHero'
import SkeletonCard from './SkeletonCard'
import { tmdbImage } from '../utils/image'
import './Landing.css'

const fallbackTrending = [
  { id: 693134, title: 'Dune: Part Two', release_date: '2024-02-27', vote_average: 8.5, backdrop_path: '/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg' },
  { id: 872585, title: 'Oppenheimer', release_date: '2023-07-19', vote_average: 8.1, backdrop_path: '/fm6KqXpk3M2HVveHwCrBSSBaO0V.jpg' },
  { id: 414906, title: 'The Batman', release_date: '2022-03-01', vote_average: 7.7, backdrop_path: '/b0PlSFdDwbyK0cf5RxwDpaOJQvQ.jpg' },
  { id: 792307, title: 'Poor Things', release_date: '2023-12-07', vote_average: 7.8, backdrop_path: '/kCGlIMHnOm8JPXq3rXM6c5wMxcT.jpg' },
  { id: 157336, title: 'Interstellar', release_date: '2014-11-05', vote_average: 8.4, backdrop_path: '/xJHokMbljvjADYdit5fK5VQsXEG.jpg' },
  { id: 545611, title: 'Everything Everywhere All at Once', release_date: '2022-03-24', vote_average: 7.8, backdrop_path: '/ss0Os3uWJfQAENILHZUdX8Tt1OC.jpg' },
]

const collections = [
  { title: 'Mind-Bending Sci-Fi', count: '24 movies', image: '/xJHokMbljvjADYdit5fK5VQsXEG.jpg' },
  { title: 'Late Night Thrillers', count: '18 movies', image: '/yY76zq9XSuJ4nWyPDuwkdV7Wt0c.jpg' },
  { title: 'Films That Changed Cinema', count: '32 movies', image: '/tmU7GeKVybMWFButWEGl2M4GeiP.jpg' },
  { title: 'Hidden Masterpieces', count: '21 movies', image: '/hZkgoQYus5vegHoetLkCJzb17zJ.jpg' },
]

function RailMovieCard({ movie }) {
  const imagePath = movie.backdrop_path || movie.backdropUrl || movie.poster_path || movie.posterUrl
  const year = movie.release_date ? movie.release_date.slice(0, 4) : '2024'
  const rating = typeof movie.vote_average === 'number' ? Math.min(movie.vote_average / 2 + 0.7, 4.9).toFixed(1) : '4.7'

  return (
    <Link to={`/movies/${movie.id}`} className="landing-rail-card">
      <img src={tmdbImage(imagePath, 'w780')} alt={movie.title} loading="lazy" />
      <span className="rail-rating"><Star size={13} fill="currentColor" /> {rating}</span>
      <span className="rail-save"><Bookmark size={18} /></span>
      <div className="rail-copy">
        <h3>{movie.title}</h3>
        <p>{year}</p>
      </div>
    </Link>
  )
}

export default function Landing({ movies, onGetStarted }) {
  const trendingRef = useRef(null)
  const location = useLocation()
  const navigate = useNavigate()
  const [railOffset, setRailOffset] = useState(0)
  const allRailMovies = useMemo(() => {
    const usable = (movies || []).filter((movie) => movie.backdrop_path || movie.poster_path)
    return usable.length >= 6 ? usable : fallbackTrending
  }, [movies])
  const railMovies = useMemo(() => {
    return Array.from({ length: Math.min(6, allRailMovies.length) }, (_, index) => {
      return allRailMovies[(railOffset + index) % allRailMovies.length]
    })
  }, [allRailMovies, railOffset])

  const scrollToTrending = () => {
    trendingRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const showNextRailMovies = () => {
    setRailOffset((current) => (current + 1) % allRailMovies.length)
  }

  const openMovies = () => {
    navigate('/movies')
  }

  useEffect(() => {
    if (location.hash === '#trending') {
      setTimeout(scrollToTrending, 100)
    }
  }, [location])

  return (
    <div className="landing-page">
      <LandingHero onGetStarted={onGetStarted} onExplore={scrollToTrending} />

      <main ref={trendingRef} id="trending" className="landing-showcase">
        <section className="landing-panel landing-trending-panel">
          <div className="landing-section-heading">
            <h2>Trending Now</h2>
            <button type="button" onClick={openMovies}>
              View All <ChevronRight size={18} />
            </button>
          </div>

          {railMovies.length ? (
            <div className="landing-movie-rail">
              {railMovies.map((movie) => (
                <RailMovieCard key={movie.id} movie={movie} />
              ))}
              <button type="button" className="landing-rail-next" onClick={showNextRailMovies} aria-label="Show more trending movies">
                <ChevronRight size={26} />
              </button>
            </div>
          ) : (
            <div className="landing-skeleton-rail">
              {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          )}
        </section>

        <section className="landing-panel landing-collections-panel">
          <div className="landing-section-heading">
            <h2>Curated Collections</h2>
            <button type="button" onClick={openMovies}>
              View All <ChevronRight size={18} />
            </button>
          </div>

          <div className="landing-collection-grid">
            {collections.map((collection) => (
              <button type="button" className="landing-collection-card" key={collection.title} onClick={onGetStarted}>
                <img src={tmdbImage(collection.image, 'w780')} alt="" loading="lazy" />
                <span className="collection-save"><Bookmark size={18} /></span>
                <span className="collection-copy">
                  <strong>{collection.title}</strong>
                  <small>{collection.count}</small>
                </span>
              </button>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
