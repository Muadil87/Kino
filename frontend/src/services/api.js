import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api'
const TOKEN_KEY = 'kino_token'
let unauthorizedHandler = null

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

const tokenStorage = {
  get() {
    return sessionStorage.getItem(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY)
  },
  set(token, persistent = true) {
    sessionStorage.setItem(TOKEN_KEY, token)
    if (persistent) {
      localStorage.setItem(TOKEN_KEY, token)
    } else {
      localStorage.removeItem(TOKEN_KEY)
    }
  },
  clear() {
    sessionStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(TOKEN_KEY)
  },
}

client.interceptors.request.use((config) => {
  const token = tokenStorage.get()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      tokenStorage.clear()
      if (typeof unauthorizedHandler === 'function') {
        unauthorizedHandler()
      }
    }
    return Promise.reject(error)
  }
)

const normalizeMovie = (movie) => ({
  id: movie.tmdb_id ?? movie.id,
  tmdb_id: movie.tmdb_id ?? movie.id,
  title: movie.title,
  poster_path: movie.poster_path || null,
  release_date: movie.release_date || null,
})

const normalizeHistoryMovie = (movie) => ({
  ...normalizeMovie(movie),
  dateWatched: movie.pivot?.watched_on || null,
})

export const authApi = {
  async register(payload) {
    const response = await client.post('/register', payload)
    return response.data
  },
  async login(payload) {
    const response = await client.post('/login', payload)
    return response.data
  },
  async me() {
    const response = await client.get('/user')
    return response.data
  },
  async logout() {
    const response = await client.post('/logout')
    return response.data
  },
  saveToken(token, persistent = true) {
    tokenStorage.set(token, persistent)
  },
  clearToken() {
    tokenStorage.clear()
  },
  getToken() {
    return tokenStorage.get()
  },
  onUnauthorized(handler) {
    unauthorizedHandler = handler
  },
}

export const watchlistApi = {
  async list() {
    const response = await client.get('/watchlist')
    return (response.data.data || []).map(normalizeMovie)
  },
  async add(movie) {
    const payload = {
      tmdb_id: movie.tmdb_id ?? movie.id,
      title: movie.title,
      poster_path: movie.poster_path || null,
      release_date: movie.release_date || null,
    }
    const response = await client.post('/watchlist', payload)
    return normalizeMovie(response.data.data)
  },
  async remove(tmdbId) {
    await client.delete(`/watchlist/${tmdbId}`)
  },
}

export const reviewApi = {
  async list(tmdbId) {
    const response = await client.get(`/movies/${tmdbId}/reviews`)
    return response.data.data || []
  },
  async create(tmdbId, payload) {
    const response = await client.post(`/movies/${tmdbId}/reviews`, payload)
    return response.data.data
  },
  async remove(reviewId) {
    await client.delete(`/reviews/${reviewId}`)
  },
}

export const favoritesApi = {
  async list() {
    const response = await client.get('/favorites')
    return (response.data.data || []).map(normalizeMovie)
  },
  async add(movie) {
    const payload = {
      tmdb_id: movie.tmdb_id ?? movie.id,
      title: movie.title,
      poster_path: movie.poster_path || null,
      release_date: movie.release_date || null,
    }
    const response = await client.post('/favorites', payload)
    return normalizeMovie(response.data.data)
  },
  async remove(tmdbId) {
    await client.delete(`/favorites/${tmdbId}`)
  },
}

export const historyApi = {
  async list() {
    const response = await client.get('/history')
    return (response.data.data || []).map(normalizeHistoryMovie)
  },
  async add(movie, watchedOn) {
    const payload = {
      tmdb_id: movie.tmdb_id ?? movie.id,
      title: movie.title,
      poster_path: movie.poster_path || null,
      release_date: movie.release_date || null,
      watched_on: watchedOn || null,
    }
    await client.post('/history', payload)
  },
  async remove(tmdbId) {
    await client.delete(`/history/${tmdbId}`)
  },
}
