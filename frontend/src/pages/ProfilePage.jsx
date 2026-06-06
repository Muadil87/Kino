import { useEffect, useState } from 'react'
import Profile from '../components/Profile'
import { profileApi } from '../services/api'

export default function ProfilePage() {
  const [profileData, setProfileData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadProfile = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await profileApi.me()
      setProfileData(data)
    } catch {
      setError('Failed to load your profile.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProfile()
  }, [])

  return (
    <Profile
      profileData={profileData}
      loading={loading}
      error={error}
      onRefresh={loadProfile}
    />
  )
}
