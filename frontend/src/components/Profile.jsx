import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  AtSign,
  ChevronRight,
  Clapperboard,
  Lock,
  Mail,
  Settings,
  Star,
  Tag,
  User,
} from 'lucide-react'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { profileApi } from '../services/api'
import { getGenres, searchMovies, searchPeople } from '../services/tmdb'
import { tmdbImage } from '../utils/image'
import './Profile.css'

const TABS = ['watched', 'watchlist', 'favorites', 'reviews']

const formatMonthYear = (value) => {
  if (!value) return 'Unknown'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Unknown'
  return date.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
}

const initials = (name) =>
  (name || 'US')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('')

const normalizeGenres = (value) => {
  if (Array.isArray(value)) return value.filter(Boolean)
  if (typeof value === 'string') {
    return value
      .split(',')
      .map((g) => g.trim())
      .filter(Boolean)
  }
  return []
}

function RatingStars({ count = 4 }) {
  return (
    <div className="rating-stars">
      {[0, 1, 2, 3, 4].map((i) => (
        <Star key={i} size={15} className={i < count ? 'filled' : ''} />
      ))}
    </div>
  )
}

function SettingsRow({ icon, title, subtitle, onClick }) {
  return (
    <button type="button" className="settings-row" onClick={onClick}>
      <span className="settings-row-icon">{icon}</span>
      <span className="settings-row-copy">
        <span className="settings-row-title">{title}</span>
        <span className="settings-row-subtitle">{subtitle}</span>
      </span>
      <ChevronRight size={17} className="settings-row-arrow" />
    </button>
  )
}

export default function Profile({ profileData, loading, error, onRefresh }) {
  const avatarInputRef = useRef(null)
  const coverInputRef = useRef(null)
  const [activeTab, setActiveTab] = useState('watched')
  const [activeEditor, setActiveEditor] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [saveMessage, setSaveMessage] = useState('')
  const [assetVersion, setAssetVersion] = useState(Date.now())
  const [localAvatar, setLocalAvatar] = useState('')
  const [localCover, setLocalCover] = useState('')
  const [genreSuggestions, setGenreSuggestions] = useState([])
  const [movieSuggestions, setMovieSuggestions] = useState([])
  const [directorSuggestions, setDirectorSuggestions] = useState([])
  const [genreDraft, setGenreDraft] = useState('')
  const [avatarLoadFailed, setAvatarLoadFailed] = useState(false)

  const user = profileData?.user || {}
  const profile = profileData?.profile || {}
  const stats = profileData?.stats || {}
  const library = profileData?.library || { watched: [], watchlist: [], favorites: [], reviews: [] }

  const [form, setForm] = useState({
    name: '',
    email: '',
    bio: '',
    favorite_genres: [],
    favorite_movie: '',
    favorite_movie_poster_path: '',
    favorite_movie_year: null,
    favorite_director: '',
    favorite_director_image_path: '',
    current_password: '',
    password: '',
    password_confirmation: '',
  })

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      name: user.name || '',
      email: user.email || '',
      bio: profile.bio || '',
      favorite_genres: normalizeGenres(profile.favorite_genres),
      favorite_movie: profile.favorite_movie || '',
      favorite_movie_poster_path: profile.favorite_movie_poster_path || '',
      favorite_movie_year: profile.favorite_movie_year || null,
      favorite_director: profile.favorite_director || '',
      favorite_director_image_path: profile.favorite_director_image_path || '',
    }))
  }, [
    user.name,
    user.email,
    profile.bio,
    profile.favorite_genres,
    profile.favorite_movie,
    profile.favorite_movie_poster_path,
    profile.favorite_movie_year,
    profile.favorite_director,
    profile.favorite_director_image_path,
  ])

  useEffect(() => {
    getGenres()
      .then((rows) => setGenreSuggestions((rows || []).map((g) => g.name)))
      .catch(() => setGenreSuggestions([]))
  }, [])

  useEffect(() => {
    const timer = setTimeout(async () => {
      if ((form.favorite_movie || '').trim().length < 2) {
        setMovieSuggestions([])
        return
      }
      try {
        const rows = await searchMovies(form.favorite_movie.trim())
        setMovieSuggestions((rows || []).slice(0, 6))
      } catch {
        setMovieSuggestions([])
      }
    }, 250)
    return () => clearTimeout(timer)
  }, [form.favorite_movie])

  useEffect(() => {
    const timer = setTimeout(async () => {
      if ((form.favorite_director || '').trim().length < 2) {
        setDirectorSuggestions([])
        return
      }
      try {
        const rows = await searchPeople(form.favorite_director.trim())
        setDirectorSuggestions((rows || []).filter((p) => p.known_for_department === 'Directing').slice(0, 6))
      } catch {
        setDirectorSuggestions([])
      }
    }, 250)
    return () => clearTimeout(timer)
  }, [form.favorite_director])

  const avatarSrc = useMemo(() => {
    if (avatarLoadFailed) return ''
    if (localAvatar) return localAvatar
    if (!profile.avatar_url) return 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=600&q=80'
    return `${profile.avatar_url}?v=${assetVersion}`
  }, [avatarLoadFailed, localAvatar, profile.avatar_url, assetVersion])

  const coverStyle = useMemo(() => {
    const source = localCover
      || (profile.cover_url ? `${profile.cover_url}?v=${assetVersion}` : 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=1600&q=80')
    return { backgroundImage: `linear-gradient(120deg, rgba(7,9,16,0.83), rgba(7,9,16,0.64)), url(${source})` }
  }, [localCover, profile.cover_url, assetVersion])

  const activeItems = library[activeTab] || []
  const libraryPreview = (activeItems || []).slice(0, 5)

  const clearStatus = () => {
    setSaveError('')
    setSaveMessage('')
  }

  const uploadAvatar = async (file) => {
    if (!file) return
    const preview = URL.createObjectURL(file)
    setLocalAvatar(preview)
    setSaving(true)
    clearStatus()
    try {
      await profileApi.updateAvatar(file)
      await onRefresh()
      setAssetVersion(Date.now())
      setSaveMessage('Profile picture updated.')
    } catch {
      setSaveError('Could not update profile picture.')
      setLocalAvatar('')
    } finally {
      setSaving(false)
    }
  }

  const uploadCover = async (file) => {
    if (!file) return
    const preview = URL.createObjectURL(file)
    setLocalCover(preview)
    setSaving(true)
    clearStatus()
    try {
      await profileApi.updateCover(file)
      await onRefresh()
      setAssetVersion(Date.now())
      setSaveMessage('Background updated.')
    } catch {
      setSaveError('Could not update background.')
      setLocalCover('')
    } finally {
      setSaving(false)
    }
  }

  const saveProfile = async () => {
    setSaving(true)
    clearStatus()
    try {
      await profileApi.update({
        name: form.name.trim(),
        email: form.email.trim(),
        bio: form.bio.trim() || null,
        favorite_genres: form.favorite_genres,
        favorite_movie: form.favorite_movie.trim() || null,
        favorite_movie_poster_path: form.favorite_movie_poster_path || null,
        favorite_movie_year: form.favorite_movie_year || null,
        favorite_director: form.favorite_director.trim() || null,
        favorite_director_image_path: form.favorite_director_image_path || null,
      })
      await onRefresh()
      setSaveMessage('Profile updated.')
      setActiveEditor(null)
    } catch {
      setSaveError('Could not save profile.')
    } finally {
      setSaving(false)
    }
  }

  const savePassword = async () => {
    setSaving(true)
    clearStatus()
    try {
      await profileApi.updatePassword({
        current_password: form.current_password,
        password: form.password,
        password_confirmation: form.password_confirmation,
      })
      setForm((prev) => ({
        ...prev,
        current_password: '',
        password: '',
        password_confirmation: '',
      }))
      setSaveMessage('Password updated.')
      setActiveEditor(null)
    } catch {
      setSaveError('Could not update password.')
    } finally {
      setSaving(false)
    }
  }

  const addGenre = (value) => {
    const clean = value.trim()
    if (!clean || form.favorite_genres.includes(clean)) return
    setForm((prev) => ({ ...prev, favorite_genres: [...prev.favorite_genres, clean] }))
    setGenreDraft('')
  }

  const renderEditor = (key) => {
    if (activeEditor !== key) return null

    if (key === 'name') {
      return (
        <div className="editor-inline">
          <label>Username</label>
          <input value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} />
          <Button variant="secondary" onClick={saveProfile} disabled={saving}>Save</Button>
        </div>
      )
    }

    if (key === 'email') {
      return (
        <div className="editor-inline">
          <label>Email</label>
          <input type="email" value={form.email} onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))} />
          <Button variant="secondary" onClick={saveProfile} disabled={saving}>Save</Button>
        </div>
      )
    }

    if (key === 'bio') {
      return (
        <div className="editor-inline">
          <label>Bio</label>
          <textarea rows={4} value={form.bio} onChange={(e) => setForm((prev) => ({ ...prev, bio: e.target.value }))} />
          <Button variant="secondary" onClick={saveProfile} disabled={saving}>Save</Button>
        </div>
      )
    }

    if (key === 'taste') {
      return (
        <div className="editor-inline">
          <label>Favorite Genres (press Enter)</label>
          <input
            value={genreDraft}
            list="profile-genre-options"
            placeholder="Type a genre"
            onChange={(e) => setGenreDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                addGenre(genreDraft)
              }
            }}
          />
          <Button variant="secondary" onClick={() => addGenre(genreDraft)} disabled={!genreDraft.trim()}>Add Genre</Button>
          <datalist id="profile-genre-options">
            {genreSuggestions.map((g) => <option key={g} value={g} />)}
          </datalist>
          <div className="chips-row editable-chips">
            {form.favorite_genres.map((g) => (
              <button
                key={g}
                type="button"
                className="chip remove-chip"
                onClick={() => setForm((prev) => ({ ...prev, favorite_genres: prev.favorite_genres.filter((x) => x !== g) }))}
              >
                {g} x
              </button>
            ))}
          </div>

          <label>Favorite Movie</label>
          <input value={form.favorite_movie} onChange={(e) => setForm((prev) => ({ ...prev, favorite_movie: e.target.value }))} placeholder="Start typing a movie title" />
          {!!movieSuggestions.length && (
            <div className="suggest-list">
              {movieSuggestions.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    setForm((prev) => ({
                      ...prev,
                      favorite_movie: m.title || '',
                      favorite_movie_poster_path: m.poster_path || '',
                      favorite_movie_year: m.release_date ? Number(m.release_date.slice(0, 4)) : null,
                    }))
                    setMovieSuggestions([])
                  }}
                >
                  {m.poster_path && <img src={tmdbImage(m.poster_path, 'w92')} alt={m.title} />}
                  <span>{m.title} {m.release_date ? `(${m.release_date.slice(0, 4)})` : ''}</span>
                </button>
              ))}
            </div>
          )}

          <label>Favorite Director</label>
          <input value={form.favorite_director} onChange={(e) => setForm((prev) => ({ ...prev, favorite_director: e.target.value }))} placeholder="Start typing a director name" />
          {!!directorSuggestions.length && (
            <div className="suggest-list">
              {directorSuggestions.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => {
                    setForm((prev) => ({
                      ...prev,
                      favorite_director: d.name || '',
                      favorite_director_image_path: d.profile_path || '',
                    }))
                    setDirectorSuggestions([])
                  }}
                >
                  {d.profile_path && <img className="suggest-avatar" src={tmdbImage(d.profile_path, 'w185')} alt={d.name} />}
                  <span>{d.name}</span>
                </button>
              ))}
            </div>
          )}

          <Button variant="secondary" onClick={saveProfile} disabled={saving}>Save Taste Profile</Button>
        </div>
      )
    }

    if (key === 'password') {
      return (
        <div className="editor-inline">
          <label>Current Password</label>
          <input type="password" value={form.current_password} onChange={(e) => setForm((prev) => ({ ...prev, current_password: e.target.value }))} />
          <label>New Password</label>
          <input type="password" value={form.password} onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))} />
          <label>Confirm Password</label>
          <input type="password" value={form.password_confirmation} onChange={(e) => setForm((prev) => ({ ...prev, password_confirmation: e.target.value }))} />
          <Button variant="secondary" onClick={savePassword} disabled={saving}>Update Password</Button>
        </div>
      )
    }

    return null
  }

  if (loading) return <div className="profile-page"><Card className="kino-panel profile-loading">Loading profile...</Card></div>
  if (error) return <div className="profile-page"><Card className="kino-panel profile-loading">{error}</Card></div>

  return (
    <div className="profile-page profile-page-cinematic">
      <input ref={avatarInputRef} type="file" className="hidden-input" accept="image/*" onChange={(e) => uploadAvatar(e.target.files?.[0])} />
      <input ref={coverInputRef} type="file" className="hidden-input" accept="image/*" onChange={(e) => uploadCover(e.target.files?.[0])} />

      <div className="profile-layout">
        <main className="profile-main">
          <Card className="kino-panel profile-hero">
            <div className="hero-backdrop" style={coverStyle} />
            <button type="button" className="hero-edit-btn" onClick={() => setActiveEditor(activeEditor === 'bio' ? null : 'bio')}>
              Edit Profile
            </button>
            <button type="button" className="hero-avatar-wrap" onClick={() => avatarInputRef.current?.click()} title="Change profile picture">
              {avatarSrc ? <img src={avatarSrc} alt={user.name || 'avatar'} className="hero-avatar" onError={() => setAvatarLoadFailed(true)} /> : <span className="hero-avatar-initials">{initials(user.name)}</span>}
            </button>
            <div className="hero-main">
              <h1>{user.name || 'User'}</h1>
              <p className="hero-username">@{(user.name || 'user').replace(/\s+/g, '').toLowerCase()}</p>
              <p className="hero-email">{user.email || ''}</p>
              <p className="hero-bio">{form.bio || 'Film lover. Story seeker. Always watching.'}</p>
              <p className="hero-joined">Joined {formatMonthYear(user.created_at)}</p>
            </div>
          </Card>

          {activeEditor === 'bio' && (
            <Card className="kino-panel editor-card">
              <div className="editor-inline">
                <label>Bio</label>
                <textarea
                  rows={4}
                  value={form.bio}
                  onChange={(e) => setForm((prev) => ({ ...prev, bio: e.target.value }))}
                />
                <Button variant="secondary" onClick={saveProfile} disabled={saving}>Save Bio</Button>
              </div>
            </Card>
          )}

          <section className="profile-stats-bar kino-panel">
            <div className="stat-pair"><Clapperboard size={18} className="stat-icon" /><p className="stat-num">{stats.watched_count ?? 0}</p><p className="stat-title">Watched</p></div>
            <div className="stat-pair"><Tag size={18} className="stat-icon" /><p className="stat-num">{stats.watchlist_count ?? 0}</p><p className="stat-title">Watchlist</p></div>
            <div className="stat-pair"><Star size={18} className="stat-icon" /><p className="stat-num">{stats.favorites_count ?? 0}</p><p className="stat-title">Favorites</p></div>
            <div className="stat-pair"><Mail size={18} className="stat-icon" /><p className="stat-num">{stats.reviews_count ?? 0}</p><p className="stat-title">Reviews</p></div>
          </section>

          <section className="profile-workspace kino-panel">
            <div className="profile-workspace-grid">
              <section className="about-column">
                <h2><User size={20} /> About</h2>
                <p className="about-copy">{form.bio || 'I love movies that make me feel something. Always looking for great storytelling.'}</p>

                <div className="about-section">
                  <h3><Tag size={18} /> Favorite Genres</h3>
                  <div className="chips-row">
                    {(form.favorite_genres || []).length > 0
                      ? form.favorite_genres.map((g) => <span key={g} className="chip">{g}</span>)
                      : <span className="muted">No genres selected yet.</span>}
                  </div>
                </div>

                <div className="about-section">
                  <h3><Star size={18} /> Favorite Movie</h3>
                  <div className="favorite-line">
                    {form.favorite_movie_poster_path && (
                      <img src={tmdbImage(form.favorite_movie_poster_path, 'w185')} alt={form.favorite_movie} />
                    )}
                    <div>
                      <p className="favorite-title">{form.favorite_movie || 'Not set'}</p>
                      {form.favorite_movie_year && <p className="muted">{form.favorite_movie_year}</p>}
                      <RatingStars count={4} />
                    </div>
                  </div>
                </div>

                <div className="about-section">
                  <h3><Clapperboard size={18} /> Favorite Director</h3>
                  <div className="favorite-line director-line">
                    {form.favorite_director_image_path && (
                      <img className="director-avatar" src={tmdbImage(form.favorite_director_image_path, 'w185')} alt={form.favorite_director} />
                    )}
                    <p className="favorite-title">{form.favorite_director || 'Not set'}</p>
                  </div>
                </div>
              </section>

              <section className="settings-column">
                <h2><Settings size={20} /> Account Settings</h2>
                <p className="muted">Manage your account information</p>
                {saveMessage && <p className="ok">{saveMessage}</p>}
                {saveError && <p className="err">{saveError}</p>}

                <div className="settings-rows">
                  <div className="settings-row-block">
                    <SettingsRow icon={<User size={18} />} title="Change Bio" subtitle="Update your short profile intro" onClick={() => setActiveEditor(activeEditor === 'bio' ? null : 'bio')} />
                    {renderEditor('bio')}
                  </div>
                  <div className="settings-row-block">
                    <SettingsRow icon={<AtSign size={18} />} title="Change Username" subtitle={form.name || '@username'} onClick={() => setActiveEditor(activeEditor === 'name' ? null : 'name')} />
                    {renderEditor('name')}
                  </div>
                  <div className="settings-row-block">
                    <SettingsRow icon={<Mail size={18} />} title="Change Email" subtitle={form.email || 'user@email.com'} onClick={() => setActiveEditor(activeEditor === 'email' ? null : 'email')} />
                    {renderEditor('email')}
                  </div>
                  <div className="settings-row-block">
                    <SettingsRow icon={<Tag size={18} />} title="Update Favorites" subtitle="Genres, movie, and director" onClick={() => setActiveEditor(activeEditor === 'taste' ? null : 'taste')} />
                    {renderEditor('taste')}
                  </div>
                  <div className="settings-row-block">
                    <SettingsRow icon={<Lock size={18} />} title="Change Password" subtitle="Update your password" onClick={() => setActiveEditor(activeEditor === 'password' ? null : 'password')} />
                    {renderEditor('password')}
                  </div>
                </div>
              </section>
            </div>
          </section>

          <Card className="kino-panel library-card">
            <div className="library-head">
              <h2><Clapperboard size={18} /> My Library</h2>
              <Link to={`/my-cinema?tab=${activeTab}`} className="library-view-all">View All</Link>
            </div>

            <div className="library-tabs">
              {TABS.map((tab) => (
                <button key={tab} type="button" className={tab === activeTab ? 'active' : ''} onClick={() => setActiveTab(tab)}>
                  {tab[0].toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {activeTab !== 'reviews' && libraryPreview.length > 0 && (
              <div className="profile-movie-strip">
                {libraryPreview.map((movie) => (
                  <Link to={`/movie/${movie.id}`} className="profile-movie-card" key={`${activeTab}-${movie.id}`}>
                    <div className="poster-wrap">
                      <img src={tmdbImage(movie.poster_path, 'w342')} alt={movie.title} />
                    </div>
                    <p className="movie-name">{movie.title}</p>
                    <p className="movie-year">{movie.release_date ? movie.release_date.slice(0, 4) : 'N/A'}</p>
                    <RatingStars count={4} />
                  </Link>
                ))}
              </div>
            )}

            {activeTab === 'reviews' && activeItems.length > 0 && (
              <div className="reviews-list">
                {activeItems.slice(0, 5).map((review) => (
                  <article key={review.id} className="review-item">
                    <h3>{review.movie?.title || 'Unknown movie'}</h3>
                    <p className="muted">Rating: {review.rating}/5</p>
                    <p>{review.content}</p>
                  </article>
                ))}
              </div>
            )}

            {!activeItems.length && <div className="empty-box">No items in this section yet.</div>}
          </Card>
        </main>
      </div>
    </div>
  )
}
