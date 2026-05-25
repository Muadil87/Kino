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
    } catch (err) {
      const message = err?.response?.data?.message || 'Failed to load your profile.'
      setError(message)
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
