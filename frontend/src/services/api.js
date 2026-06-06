import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api'
const TOKEN_KEY = 'kino_token'
const USER_KEY = 'kino_user'
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

const userStorage = {
  get() {
    const raw = sessionStorage.getItem(USER_KEY) || localStorage.getItem(USER_KEY)

    if (!raw) {
      return null
    }

    try {
      return JSON.parse(raw)
    } catch {
      this.clear()
      return null
    }
  },
  set(user, persistent = true) {
    const serialized = JSON.stringify(user)
    sessionStorage.setItem(USER_KEY, serialized)
    if (persistent) {
      localStorage.setItem(USER_KEY, serialized)
    } else {
      localStorage.removeItem(USER_KEY)
    }
  },
  clear() {
    sessionStorage.removeItem(USER_KEY)
    localStorage.removeItem(USER_KEY)
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
      userStorage.clear()
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

const normalizePaginated = (payload, fallbackPerPage = 20) => {
  if (Array.isArray(payload)) {
    return {
      items: payload,
      meta: { currentPage: 1, lastPage: 1, perPage: payload.length || fallbackPerPage, total: payload.length || 0 },
    }
  }

  if (Array.isArray(payload?.data) && typeof payload?.current_page === 'number') {
    return {
      items: payload.data,
      meta: {
        currentPage: payload.current_page,
        lastPage: payload.last_page || 1,
        perPage: payload.per_page || fallbackPerPage,
        total: payload.total || payload.data.length || 0,
      },
    }
  }

  const list = Array.isArray(payload?.data) ? payload.data : []
  return {
    items: list,
    meta: { currentPage: 1, lastPage: 1, perPage: list.length || fallbackPerPage, total: list.length || 0 },
  }
}

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
  saveSession(user, token, persistent = true) {
    tokenStorage.set(token, persistent)
    userStorage.set(user, persistent)
  },
  saveToken(token, persistent = true) {
    tokenStorage.set(token, persistent)
  },
  saveUser(user, persistent = true) {
    userStorage.set(user, persistent)
  },
  clearToken() {
    tokenStorage.clear()
    userStorage.clear()
  },
  getToken() {
    return tokenStorage.get()
  },
  getUser() {
    return userStorage.get()
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

export const movieRatingApi = {
  async get(tmdbId) {
    const response = await client.get(`/movies/${tmdbId}/rating`)
    return response.data.data || { rating: null }
  },
  async set(tmdbId, payload) {
    const response = await client.put(`/movies/${tmdbId}/rating`, payload)
    return response.data.data || { rating: null }
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

export const friendApi = {
  async list() {
    const response = await client.get('/friends')
    return response.data.data || []
  },
  async requests({ page = 1, perPage = 20 } = {}) {
    const response = await client.get('/friends/requests', { params: { page, per_page: perPage } })
    return normalizePaginated(response.data, perPage)
  },
  async send(payload) {
    const response = await client.post('/friends/requests', payload)
    return response.data.data
  },
  async accept(id) {
    await client.post(`/friends/requests/${id}/accept`)
  },
  async decline(id) {
    await client.post(`/friends/requests/${id}/decline`)
  },
  async block(id) {
    await client.post(`/friends/${id}/block`)
  },
  async remove(id) {
    await client.delete(`/friends/${id}`)
  },
}

export const communityApi = {
  async list() {
    const response = await client.get('/communities')
    return response.data.data || { joined: [], discover: [] }
  },
  async create(payload) {
    const response = await client.post('/communities', payload)
    return response.data.data
  },
  async get(slug) {
    const response = await client.get(`/communities/${slug}`)
    return response.data.data
  },
  async join(slug) {
    await client.post(`/communities/${slug}/join`)
  },
  async leave(slug) {
    await client.post(`/communities/${slug}/leave`)
  },
  async members(slug, { page = 1, perPage = 24 } = {}) {
    const response = await client.get(`/communities/${slug}/members`, { params: { page, per_page: perPage } })
    return normalizePaginated(response.data, perPage)
  },
  async posts(slug, { page = 1, perPage = 20 } = {}) {
    const response = await client.get(`/communities/${slug}/posts`, { params: { page, per_page: perPage } })
    return normalizePaginated(response.data, perPage)
  },
  async createPost(slug, payload) {
    const response = await client.post(`/communities/${slug}/posts`, payload)
    return response.data.data
  },
  async comment(slug, postId, payload) {
    const response = await client.post(`/communities/${slug}/posts/${postId}/comments`, payload)
    return response.data.data
  },
  async challenges(slug, { page = 1, perPage = 20 } = {}) {
    const response = await client.get(`/communities/${slug}/challenges`, { params: { page, per_page: perPage } })
    return normalizePaginated(response.data, perPage)
  },
  async createChallenge(slug, payload) {
    const response = await client.post(`/communities/${slug}/challenges`, payload)
    return response.data.data
  },
  async leaderboard(slug, { page = 1, perPage = 12 } = {}) {
    const response = await client.get(`/communities/${slug}/leaderboard`, { params: { page, per_page: perPage } })
    return normalizePaginated(response.data, perPage)
  },
  async stats(slug) {
    const response = await client.get(`/communities/${slug}/stats`)
    return response.data.data || {}
  },
}

export const activityApi = {
  async feed({ page = 1, perPage = 30 } = {}) {
    const response = await client.get('/activity/feed', { params: { page, per_page: perPage } })
    return normalizePaginated(response.data, perPage)
  },
  async unified({ scope = 'home', page = 1, perPage = 30 } = {}) {
    const response = await client.get('/activity/feed', { params: { scope, page, per_page: perPage } })
    return normalizePaginated(response.data, perPage)
  },
  async community(slug, { page = 1, perPage = 30 } = {}) {
    const response = await client.get(`/communities/${slug}/activity`, { params: { page, per_page: perPage } })
    return normalizePaginated(response.data, perPage)
  },
}

export const profileApi = {
  async me() {
    const response = await client.get('/me/profile')
    return response.data.data
  },
  async update(payload) {
    const response = await client.patch('/me/profile', payload)
    return response.data
  },
  async updatePassword(payload) {
    const response = await client.patch('/me/password', payload)
    return response.data
  },
  async updateAvatar(file) {
    const formData = new FormData()
    formData.append('avatar', file)
    const response = await client.post('/me/profile/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  },
  async updateCover(file) {
    const formData = new FormData()
    formData.append('cover', file)
    const response = await client.post('/me/profile/cover', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  },
  async meProgress() {
    const response = await client.get('/me/profile-progress')
    return response.data.data
  },
  async show(userId) {
    const response = await client.get(`/profiles/${userId}`)
    return response.data.data
  },
}

export const recommendationApi = {
  async send(payload) {
    const response = await client.post('/recommendations', payload)
    return response.data.data
  },
  async inbox() {
    const response = await client.get('/recommendations/inbox')
    return normalizePaginated(response.data, 30)
  },
  async update(id, payload) {
    const response = await client.patch(`/recommendations/${id}`, payload)
    return response.data.data
  },
}

export const telegramApi = {
  async startLink() {
    const response = await client.post('/settings/telegram/link/start')
    return response.data.data
  },
  async confirmLink(token) {
    const response = await client.post('/settings/telegram/link/confirm', { token })
    return response.data.data
  },
  async unlink() {
    await client.delete('/settings/telegram/link')
  },
  async linkCommunityGroup(slug, code) {
    const response = await client.post(`/communities/${slug}/telegram/link`, { code })
    return response.data.data
  },
  async unlinkCommunityGroup(slug) {
    await client.delete(`/communities/${slug}/telegram/link`)
  },
}
