import { useEffect, useMemo, useState } from 'react'
import { communityApi, profileApi, recommendationApi } from '../services/api'
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
  const [communities, setCommunities] = useState({ joined: [], discover: [] })
  const [recommendations, setRecommendations] = useState([])

  useEffect(() => {
    let ignore = false
    ;(async () => {
      try {
        const [progress, myCommunities, inbox] = await Promise.all([
          profileApi.meProgress(),
          communityApi.list(),
          recommendationApi.inbox(),
        ])
        if (ignore) return
        setProfileProgress(progress || null)
        setCommunities(myCommunities || { joined: [], discover: [] })
        setRecommendations((inbox.items || []).slice(0, 4))
      } catch (error) {
        if (!ignore) console.error('Failed loading home ecosystem data:', error)
      }
    })()
    return () => { ignore = true }
  }, [])

  const topDiscovery = useMemo(() => (movies || []).slice(0, 12), [movies])
  const recentHistory = useMemo(() => (history || []).slice(0, 8), [history])

  if (!movies || movies.length === 0) {
    return (
      <div className="dashboard-container">
        <CinematicSection overline="KINO Home" title="Loading Your Cinema Pulse">
          <div className="movie-grid">{[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}</div>
        </CinematicSection>
      </div>
    )
  }

  return (
    <div className="dashboard-container">
      <CinematicSection
        overline="KINO Home"
        title="Your Cinema Pulse"
        subtitle="A live snapshot of your identity, your circles, and what to watch next."
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
        overline="Social Momentum"
        title="From Your Friends"
        subtitle="Recent logs and reactions from people you trust."
      >
        <ActivityLens mode="unified" defaultScope="friends" pageSize={6} />
      </CinematicSection>

      <CinematicSection
        overline="Club Momentum"
        title="From Your Communities"
        subtitle="Shared progress and club activity from your movie circles."
      >
        <div className="social-hero-strip">
          <StatBlock label="Joined Clubs" value={communities.joined?.length || 0} />
          <StatBlock label="Discover Clubs" value={communities.discover?.length || 0} />
          <StatBlock label="Recent Club Events" value="Live" />
        </div>
        <ActivityLens mode="unified" defaultScope="community" pageSize={6} />
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
        overline="Personal Library"
        title="Continue Your Journey"
        subtitle="Your recent watch history and social recommendations."
      >
        <div className="movie-grid">
          {recentHistory.map((movie) => <MovieCard key={movie.id} movie={movie} />)}
        </div>
        <div className="post-list home-recommendations">
          {recommendations.map((r) => (
            <article className="kino-panel post-card" key={r.id}>
              <p className="post-author">{r.from_user?.name || 'Member'} · recommended</p>
              <p className="social-feature-text">{r.movie?.title || 'Movie recommendation'}</p>
            </article>
          ))}
        </div>
      </CinematicSection>
    </div>
  )
}
