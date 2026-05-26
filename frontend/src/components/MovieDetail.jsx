import React, { useMemo, useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getMovieDetails, getMovieCredits, getMovieVideos, getSimilarMovies, getMovieReviews, getMovieProviders } from '../services/tmdb'
import { movieRatingApi } from '../services/api'
import './MovieDetail.css'
import { ErrorBoundary } from './ErrorBoundary'
import { MovieHeroSection } from './MovieHeroSection'
import { MovieCastSection } from './MovieCastSection'
import { SimilarMoviesSection } from './SimilarMoviesSection'
import { MovieTrailerSection } from './MovieTrailerSection'
import { MovieReviewsSection } from './MovieReviewsSection'

function MovieDetailContent({ movies, onToggleFavorite, onToggleWatchlist, isFavorite, isInWatchlist, isLoggedIn }) {
  const { id } = useParams()
  const movieId = Number(id)
  const navigate = useNavigate()

  // State
  const [mainMovie, setMainMovie] = useState(null)
  const [isLoadingMainMovie, setIsLoadingMainMovie] = useState(false)
  const [mainMovieError, setMainMovieError] = useState(null)

  const [castData, setCastData] = useState(null)
  const [videos, setVideos] = useState([])
  const [similarMovies, setSimilarMovies] = useState([])
  const [reviews, setReviews] = useState([])
  const [providers, setProviders] = useState(null)
  const [isLoadingAncillary, setIsLoadingAncillary] = useState(false)
  const [userRating, setUserRating] = useState(0)

  // Initial load / Sync with ID
  useEffect(() => {
    // Reset or set loading
    setIsLoadingMainMovie(true)
    setMainMovieError(null)
    
    // We can try to find initial movie in the passed list
    const found = movies?.find(m => Number(m.id) === movieId)
    if (found) {
        // If found, we can set it immediately for perceived performance, 
        // but we still fetch fresh details to get full data (like runtime, etc which might be missing in list)
        setMainMovie(found)
    } else {
        setMainMovie(null)
    }

    const load = async () => {
      try {
        const data = await getMovieDetails(movieId)
        setMainMovie(data)
      } catch (err) {
        console.error('Movie load failed:', err)
        setMainMovieError(err.message || 'Failed to load movie')
      } finally {
        setIsLoadingMainMovie(false)
      }
    }
    load()
  }, [movieId, movies])

  useEffect(() => {
    let ignore = false

    const loadRating = async () => {
      if (!isLoggedIn) {
        setUserRating(0)
        return
      }

      try {
        const data = await movieRatingApi.get(movieId)
        if (!ignore) setUserRating(Number(data?.rating || 0))
      } catch {
        if (!ignore) setUserRating(0)
      }
    }

    loadRating()
    return () => { ignore = true }
  }, [movieId, isLoggedIn])

  // Ancillary Data
  useEffect(() => {
    if (!mainMovie || Number(mainMovie.id) !== movieId) return

    setIsLoadingAncillary(true)
    const loadAuxData = async () => {
      try {
        const [c, v, s, r, p] = await Promise.all([
          getMovieCredits(movieId),
          getMovieVideos(movieId),
          getSimilarMovies(movieId),
          getMovieReviews(movieId),
          getMovieProviders(movieId)
        ])
        setCastData(c)
        setVideos(v || [])
        setSimilarMovies(s || [])
        setReviews(r || [])
        setProviders(p?.US || null)
      } catch (err) {
        console.error('Ancillary data failed:', err)
        // We don't necessarily want to block the whole page for ancillary data failure
      } finally {
        setIsLoadingAncillary(false)
      }
    }
    loadAuxData()
  }, [mainMovie, movieId]) // Depend on mainMovie so we don't fetch for old movie if mainMovie hasn't updated yet

  // Computed Values
  const director = useMemo(() => {
    return castData?.crew?.find(p => p.job === 'Director')
  }, [castData])

  const uniqueProviders = useMemo(() => {
    if (!providers) return []
    const all = [
      ...(providers.flatrate || []),
      ...(providers.rent || [])
    ]
    const seen = new Set()
    return all.filter(p => {
      if (seen.has(p.provider_id)) return false
      seen.add(p.provider_id)
      return true
    })
  }, [providers])

  const handleMovieSelect = (selectedId) => {
      navigate(`/movies/${selectedId}`)
      window.scrollTo(0, 0)
  }

  const handleRateMovie = async (ratingValue) => {
    if (!isLoggedIn) {
      navigate('/login')
      return
    }

    if (!mainMovie) return

    try {
      const result = await movieRatingApi.set(movieId, {
        rating: ratingValue,
        title: mainMovie.title || 'Untitled',
        poster_path: mainMovie.poster_path || null,
        release_date: mainMovie.release_date || null,
      })
      setUserRating(Number(result?.rating || ratingValue))
    } catch (error) {
      console.error('Failed to save movie rating:', error)
    }
  }

  return (
    <div className="detail-page">
      <MovieHeroSection 
        movie={mainMovie} 
        director={director}
        providers={uniqueProviders}
        isLoading={isLoadingMainMovie} 
        error={mainMovieError}
        onToggleFavorite={onToggleFavorite}
        onToggleWatchlist={onToggleWatchlist}
        isFavorite={isFavorite}
        isInWatchlist={isInWatchlist}
        userRating={userRating}
        onRateMovie={handleRateMovie}
        isLoggedIn={isLoggedIn}
      />
      
      <MovieCastSection cast={castData?.cast} isLoading={isLoadingAncillary} />
      
      <MovieTrailerSection videos={videos} />

      <MovieReviewsSection reviews={reviews} isLoading={isLoadingAncillary} />
      
      <SimilarMoviesSection movies={similarMovies} onMovieSelect={handleMovieSelect} />
    </div>
  )
}

export default function MovieDetail(props) {
  return (
    <ErrorBoundary>
      <MovieDetailContent {...props} />
    </ErrorBoundary>
  )
}
