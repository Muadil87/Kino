import { useEffect, useState } from 'react'
import { communityApi } from '../services/api'
import CommunityCard from '../components/CommunityCard'
import '../components/Social.css'

export default function CommunitiesPage() {
  const [data, setData] = useState({ joined: [], discover: [] })
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  const load = async () => {
    const res = await communityApi.list()
    setData(res)
  }

  useEffect(() => {
    let ignore = false
    ;(async () => {
      const res = await communityApi.list()
      if (!ignore) setData(res)
    })()
    return () => {
      ignore = true
    }
  }, [])

  const create = async (e) => {
    e.preventDefault()
    if (!name.trim()) return
    await communityApi.create({ name, description, visibility: 'private' })
    setName('')
    setDescription('')
    await load()
  }

  return (
    <section className="social-page">
      <div className="section-header">
        <div>
          <p className="kino-overline">Movie Clubs</p>
          <h1 className="section-title">Communities</h1>
        </div>
        <p className="section-subtitle">Create or join clubs to share progress, recommendations, and challenge momentum.</p>
      </div>

      <form className="kino-panel social-form" onSubmit={create}>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Community name (e.g. Midnight Screeners)" />
        <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Short club description" />
        <button className="btn-ghost" type="submit">Create Club</button>
      </form>

      <h3 className="social-subtitle">Your Clubs</h3>
      <div className="social-grid">
        {data.joined.map((c) => <CommunityCard key={c.id} community={c} />)}
      </div>

      <h3 className="social-subtitle">Discover Clubs</h3>
      <div className="social-grid">
        {data.discover.map((c) => <CommunityCard key={c.id} community={c} actionLabel="Join" onAction={() => communityApi.join(c.slug).then(load)} />)}
      </div>
    </section>
  )
}
