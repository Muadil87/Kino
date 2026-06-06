import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate, Navigate, useLocation } from 'react-router-dom'
import { getTrendingMovies } from './services/tmdb'
import { authApi, watchlistApi, favoritesApi, historyApi } from './services/api'
import Navbar from './components/Navbar'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import MovieDetailPage from './pages/MovieDetailPage'
import SearchResultsPage from './pages/SearchResultsPage'
import ProfilePage from './pages/ProfilePage'
import DashboardPage from './pages/DashboardPage'
import MoviesPage from './pages/MoviesPage'
import ActivityFeedPage from './pages/ActivityFeedPage'
import MyCinemaPage from './pages/MyCinemaPage'
import './App.css'
import './components/SharedStyles.css'

function ProtectedRoute({ isLoggedIn, children }) {
  return isLoggedIn ? children : <Navigate to="/login" />
}

function PublicOnlyRoute({ isLoggedIn, children }) {
  return isLoggedIn ? <Navigate to="/" /> : children
}

function App() {
  const initialToken = authApi.getToken()
  const initialUser = authApi.getUser()

  const [movies, setMovies] = useState([])
  const [favorites, setFavorites] = useState([])
  const [watchlist, setWatchlist] = useState([])
  const [history, setHistory] = useState([])
  const [isLoggedIn, setIsLoggedIn] = useState(Boolean(initialToken && initialUser))
  const [username, setUsername] = useState(initialUser?.name || 'Movie Buff')
  const [email, setEmail] = useState(initialUser?.email || '')
  const [authBootstrapped, setAuthBootstrapped] = useState(!initialToken || Boolean(initialUser))

  const navigate = useNavigate()
  const location = useLocation()
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const trendingMovies = await getTrendingMovies()
        setMovies(trendingMovies)
      } catch (error) {
        console.error('Error loading movies:', error)
      }
    }

    fetchMovies()
  }, [])

  const loadUserLists = async () => {
    const [watchlistData, favoritesData, historyData] = await Promise.all([
      watchlistApi.list(),
      favoritesApi.list(),
      historyApi.list(),
    ])

    setWatchlist(watchlistData)
    setFavorites(favoritesData)
    setHistory(historyData)
  }

  useEffect(() => {
    const bootstrapAuth = async () => {
      const token = authApi.getToken()
      const storedUser = authApi.getUser()

      if (!token) {
        authApi.clearToken()
        setAuthBootstrapped(true)
        return
      }

      if (storedUser) {
        setIsLoggedIn(true)
        setUsername(storedUser.name || 'Movie Buff')
        setEmail(storedUser.email || '')
        setAuthBootstrapped(true)

        loadUserLists().catch(() => {
          setWatchlist([])
          setFavorites([])
          setHistory([])
        })
      }

      try {
        const user = await authApi.me()
        setIsLoggedIn(true)
        setUsername(user.name || 'Movie Buff')
        setEmail(user.email || '')
        authApi.saveUser(user, Boolean(localStorage.getItem('kino_token')))
        await loadUserLists()
      } catch {
        authApi.clearToken()
        setIsLoggedIn(false)
        setWatchlist([])
        setFavorites([])
        setHistory([])
        setUsername('Movie Buff')
        setEmail('')
      } finally {
        setAuthBootstrapped(true)
      }
    }

    bootstrapAuth()
  }, [])

  useEffect(() => {
    authApi.onUnauthorized(() => {
      setIsLoggedIn(false)
      setWatchlist([])
      setFavorites([])
      setHistory([])
      setUsername('Movie Buff')
      setEmail('')
      navigate('/login')
    })
  }, [navigate])

  const isFav = (id) => favorites.some((m) => m.id === id)
  const isInWatchlist = (id) => watchlist.some((m) => m.id === id)

  const upsertMinimal = (m) => ({
    id: m.id,
    title: m.title,
    poster_path: m.poster_path || m.posterUrl || null,
    backdrop_path: m.backdrop_path || null,
    release_date: m.release_date || null,
    vote_average: m.vote_average ?? m.rating ?? null,
    overview: m.overview || m.description || ''
  })

  const toggleFavorite = async (movie) => {
    if (!isLoggedIn) {
      navigate('/login')
      return
    }

    try {
      if (isFav(movie.id)) {
        await favoritesApi.remove(movie.id)
        setFavorites((prev) => prev.filter((x) => x.id !== movie.id))
      } else {
        const savedMovie = await favoritesApi.add(upsertMinimal(movie))
        setFavorites((prev) => [...prev, savedMovie])
      }
    } catch (error) {
      console.error('Favorites update failed:', error)
    }
  }

  const toggleWatchlist = async (movie) => {
    if (!isLoggedIn) {
      navigate('/login')
      return
    }

    try {
      if (isInWatchlist(movie.id)) {
        await watchlistApi.remove(movie.id)
        setWatchlist((prev) => prev.filter((x) => x.id !== movie.id))
      } else {
        const savedMovie = await watchlistApi.add(upsertMinimal(movie))
        setWatchlist((prev) => [...prev, savedMovie])
      }
    } catch (error) {
      console.error('Watchlist update failed:', error)
    }
  }

  const handleLogin = async (user) => {
    setIsLoggedIn(true)
    setUsername(user?.name || 'Movie Buff')
    setEmail(user?.email || '')

    try {
      await loadUserLists()
    } catch (error) {
      console.error('Failed to load lists after login:', error)
      setWatchlist([])
      setFavorites([])
      setHistory([])
    }

    navigate('/')
  }

  const handleLogout = async () => {
    try {
      await authApi.logout()
    } catch {
      // If token already expired/revoked, we still clear client session.
    }

    authApi.clearToken()
    setIsLoggedIn(false)
    setWatchlist([])
    setFavorites([])
    setHistory([])
    setUsername('Movie Buff')
    setEmail('')
    navigate('/')
  }

  if (!authBootstrapped) {
    return <div className="loading-screen">Loading authentication...</div>
  }

  return (
    <div className="app">
      <Navbar
        isLoggedIn={isLoggedIn}
        username={username}
        onLogout={handleLogout}
        watchlistCount={watchlist.length}
        favoritesCount={favorites.length}
      />

      <div className="page-transition" key={location.pathname}>
        <Routes>
          <Route
            path="/"
            element={
              isLoggedIn
                ? <DashboardPage movies={movies} history={history} />
                : <LandingPage movies={movies} onGetStarted={() => navigate('/register')} />
            }
          />

          <Route path="/login" element={
            <PublicOnlyRoute isLoggedIn={isLoggedIn}>
              <LoginPage onNavigateToSignUp={() => navigate('/register')} onLogin={handleLogin} />
            </PublicOnlyRoute>
          } />

          <Route path="/register" element={
            <PublicOnlyRoute isLoggedIn={isLoggedIn}>
              <SignupPage onNavigateToSignIn={() => navigate('/login')} onSignUp={handleLogin} />
            </PublicOnlyRoute>
          } />

          <Route path="/dashboard" element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Navigate to="/" replace />
            </ProtectedRoute>
          } />

          <Route path="/movies" element={<MoviesPage />} />

          <Route path="/activity" element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <ActivityFeedPage />
            </ProtectedRoute>
          } />
          <Route path="/my-cinema" element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <MyCinemaPage />
            </ProtectedRoute>
          } />

          <Route path="/profile" element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <ProfilePage
                username={username}
                email={email}
                watchlistCount={watchlist.length}
                favoritesCount={favorites.length}
                historyCount={history.length}
              />
            </ProtectedRoute>
          } />

          <Route path="/search" element={<SearchResultsPage />} />

          <Route path="/movies/:id" element={
            <MovieDetailPage
              movies={movies}
              isFavorite={isFav}
              onToggleFavorite={toggleFavorite}
              isInWatchlist={isInWatchlist}
              onToggleWatchlist={toggleWatchlist}
              isLoggedIn={isLoggedIn}
            />
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      {!['/', '/login', '/register'].includes(location.pathname.replace(/\/$/, '') || '/') && (
        <footer className="footer">
          <div className="footer-container">
            <div className="footer-bottom">
              <p>&copy; 2024 KINO. All rights reserved.</p>
            </div>
          </div>
        </footer>
      )}
    </div>
  )
}

export default App
