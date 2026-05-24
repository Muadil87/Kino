import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate, Navigate, useLocation } from 'react-router-dom'
import { getTrendingMovies } from './services/tmdb'
import { authApi, watchlistApi, favoritesApi, historyApi } from './services/api'
import Navbar from './components/Navbar'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import WatchlistPage from './pages/WatchlistPage'
import CollectionsPage from './pages/CollectionsPage'
import CollectionDetailPage from './pages/CollectionDetailPage'
import MovieDetailPage from './pages/MovieDetailPage'
import SearchResultsPage from './pages/SearchResultsPage'
import FavoritesPage from './pages/FavoritesPage'
import ProfilePage from './pages/ProfilePage'
import SettingsPage from './pages/SettingsPage'
import DashboardPage from './pages/DashboardPage'
import './App.css'
import './components/SharedStyles.css'

function ProtectedRoute({ isLoggedIn, children }) {
  return isLoggedIn ? children : <Navigate to="/login" />
}

function PublicOnlyRoute({ isLoggedIn, children }) {
  return isLoggedIn ? <Navigate to="/dashboard" /> : children
}

function App() {
  const [movies, setMovies] = useState([])
  const [favorites, setFavorites] = useState([])
  const [watchlist, setWatchlist] = useState([])
  const [history, setHistory] = useState([])
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState('Movie Buff')
  const [email, setEmail] = useState('')
  const [authBootstrapped, setAuthBootstrapped] = useState(false)

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
      if (!token) {
        setAuthBootstrapped(true)
        return
      }

      try {
        const user = await authApi.me()
        setIsLoggedIn(true)
        setUsername(user.name || 'Movie Buff')
        setEmail(user.email || '')
        await loadUserLists()
      } catch {
        authApi.clearToken()
        setIsLoggedIn(false)
        setWatchlist([])
        setFavorites([])
        setHistory([])
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

  const moveToHistory = async (movie) => {
    const today = new Date().toISOString().slice(0, 10)

    try {
      await historyApi.add(upsertMinimal(movie), today)
      setHistory((prev) => [
        { ...upsertMinimal(movie), dateWatched: today },
        ...prev.filter((x) => x.id !== movie.id),
      ])

      if (isInWatchlist(movie.id)) {
        await watchlistApi.remove(movie.id)
        setWatchlist((prev) => prev.filter((x) => x.id !== movie.id))
      }
    } catch (error) {
      console.error('History update failed:', error)
    }
  }

  const removeFromHistory = async (movie) => {
    try {
      await historyApi.remove(movie.id)
      setHistory((prev) => prev.filter((x) => x.id !== movie.id))
    } catch (error) {
      console.error('Remove history failed:', error)
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

    navigate('/dashboard')
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
          <Route path="/" element={
            <PublicOnlyRoute isLoggedIn={isLoggedIn}>
              <LandingPage movies={movies} onGetStarted={() => navigate('/signup')} />
            </PublicOnlyRoute>
          } />

          <Route path="/login" element={
            <PublicOnlyRoute isLoggedIn={isLoggedIn}>
              <LoginPage onNavigateToSignUp={() => navigate('/signup')} onLogin={handleLogin} />
            </PublicOnlyRoute>
          } />

          <Route path="/signup" element={
            <PublicOnlyRoute isLoggedIn={isLoggedIn}>
              <SignupPage onNavigateToSignIn={() => navigate('/login')} onSignUp={handleLogin} />
            </PublicOnlyRoute>
          } />

          <Route path="/dashboard" element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <DashboardPage movies={movies} />
            </ProtectedRoute>
          } />

          <Route path="/collections" element={<CollectionsPage isLoggedIn={isLoggedIn} />} />

          <Route path="/collections/:id/:name" element={<CollectionDetailPage isLoggedIn={isLoggedIn} />} />

          <Route path="/watchlist" element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <WatchlistPage
                watchlist={watchlist}
                history={history}
                onRemoveFromWatchlist={(movie) => toggleWatchlist(movie)}
                onRemoveFromHistory={(movie) => removeFromHistory(movie)}
                onMoveToHistory={(movie) => moveToHistory(movie)}
              />
            </ProtectedRoute>
          } />

          <Route path="/favorites" element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <FavoritesPage movies={favorites} />
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

          <Route path="/settings" element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <SettingsPage username={username} setUsername={setUsername} />
            </ProtectedRoute>
          } />

          <Route path="/search" element={<SearchResultsPage />} />

          <Route path="/movie/:id" element={
            <MovieDetailPage
              movies={movies}
              isFavorite={isFav}
              onToggleFavorite={toggleFavorite}
              isInWatchlist={isInWatchlist}
              onToggleWatchlist={toggleWatchlist}
              isLoggedIn={isLoggedIn}
            />
          } />
        </Routes>
      </div>

      {!['/', '/login', '/signup'].includes(location.pathname.replace(/\/$/, '') || '/') && (
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
