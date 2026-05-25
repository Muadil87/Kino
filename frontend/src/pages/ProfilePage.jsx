import { useEffect, useState } from 'react'
import Profile from '../components/Profile'
import { authApi, profileApi } from '../services/api'

export default function ProfilePage({
  username,
  email,
  watchlistCount,
  favoritesCount,
  historyCount,
}) {
  const [meProgress, setMeProgress] = useState(null)
  const [publicProfile, setPublicProfile] = useState(null)

  useEffect(() => {
    let ignore = false
    ;(async () => {
      try {
        const me = await authApi.me()
        const [progress, profile] = await Promise.all([
          profileApi.meProgress(),
          profileApi.show(me.id),
        ])
        if (ignore) return
        setMeProgress(progress)
        setPublicProfile(profile)
      } catch (error) {
        if (!ignore) {
          console.error('Failed to load profile identity data:', error)
        }
      }
    })()
    return () => {
      ignore = true
    }
  }, [])

  return (
    <Profile
      username={username}
      email={email}
      watchlistCount={watchlistCount}
      favoritesCount={favoritesCount}
      historyCount={historyCount}
      meProgress={meProgress}
      publicProfile={publicProfile}
    />
  )
}
