import { useEffect, useMemo, useState } from 'react'
import { profileApi } from '../services/api'
import MovieCard from './MovieCard'
import SkeletonCard from './SkeletonCard'
import BadgeChip from './BadgeChip'
import CinematicSection from './CinematicSection'
import StatBlock from './StatBlock'
import ActivityLens from './ActivityLens'
import './Dashboard.css'
import './Social.css'

const badgeLabel = (code) => {
  const map = {
    first_watch: 'First Watch',
    cinephile_10: 'Cinephile 10',
    first_review: 'First Review',
    streak_7: '7-Day Streak',
  }
  return map[code] || String(code || '').replaceAll('_', ' ')
}

export default function Dashboard({ movies, history }) {
  const [profileProgress, setProfileProgress] = useState(null)

  useEffect(() => {
    let ignore = false
    ;(async () => {
      try {
        const progress = await profileApi.meProgress()
        if (ignore) return
        setProfileProgress(progress || null)
      } catch (error) {
        if (!ignore) console.error('Failed loading home data:', error)
      }
    })()
    return () => { ignore = true }
  }, [])

  const topDiscovery = useMemo(() => (movies || []).slice(0, 12), [movies])
  const recentHistory = useMemo(() => (history || []).slice(0, 8), [history])

  if (!movies || movies.length === 0) {
    return (
      <div className="dashboard-container">
        <CinematicSection overline="KINO Home" title="Loading Your Cinema Home">
          <div className="movie-grid">{[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}</div>
        </CinematicSection>
      </div>
    )
  }

  return (
    <div className="dashboard-container">
      <CinematicSection
        overline="KINO Home"
        title="Your Cinema Home"
        subtitle="Discover movies, track your progress, and keep your watch journey moving."
      >
        <div className="social-hero-strip">
          <StatBlock label="Level" value={profileProgress?.level ?? 1} />
          <StatBlock label="XP" value={profileProgress?.xp_total ?? 0} />
          <StatBlock label="Streak" value={`${profileProgress?.current_streak_days ?? 0} days`} />
        </div>
        <div className="badges-row">
          {(profileProgress?.badges || []).slice(0, 5).map((badge) => (
            <BadgeChip key={badge.id || badge.badge_code} label={badgeLabel(badge.badge_code)} />
          ))}
        </div>
      </CinematicSection>

      <CinematicSection
        overline="Friends"
        title="From People You Follow"
        subtitle="Recent watches, ratings, and watchlist adds from your network."
      >
        <ActivityLens mode="unified" defaultScope="friends" pageSize={6} />
      </CinematicSection>

      <CinematicSection
        overline="Discovery"
        title="Trending For Tonight"
        subtitle="Fresh picks to keep your cinematic journey moving."
      >
        <div className="movie-grid">
          {topDiscovery.map((movie) => <MovieCard key={movie.id} movie={movie} />)}
        </div>
      </CinematicSection>

      <CinematicSection
        overline="Library"
        title="Continue Your Journey"
        subtitle="Your recent watched movies."
      >
        <div className="movie-grid">
          {recentHistory.map((movie) => <MovieCard key={movie.id} movie={movie} />)}
        </div>
      </CinematicSection>
    </div>
  )
}
