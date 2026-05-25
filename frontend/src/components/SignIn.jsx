import React from 'react'
import { authApi } from '../services/api'
import { Button } from './ui/button'
import { Card } from './ui/card'
import { Input } from './ui/input'
import Icon from './ui/Icon'
import './Auth.css'

export default function SignIn({ onNavigateToSignUp, onLogin }) {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [error, setError] = React.useState('')
  const [loading, setLoading] = React.useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const data = await authApi.login({ email, password })
      authApi.saveToken(data.token)
      onLogin(data.user)
    } catch (err) {
      setError(err.response?.data?.message || 'Sign in failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <img
        src="https://image.tmdb.org/t/p/w1280/iwgl8zlrrfvfWp9k9Paj8lvFEvS.jpg"
        alt="Cinematic Movie Scene"
        className="auth-bg-image"
        loading="lazy"
        onError={(e) => { e.target.style.display = 'none' }}
      />
      <Card className="auth-card">
        <h2 className="auth-title"><Icon name="cinema" size={20} tone="gold" />Welcome Back</h2>
        <p className="auth-subtitle">Sign in to continue curating your cinema.</p>
        {error && <div className="auth-error" role="alert">{error}</div>}
        <form onSubmit={handleSubmit}>
          <label className="auth-label" htmlFor="email">Email</label>
          <Input
            variant="unstyled"
            type="email"
            id="email"
            placeholder="Email"
            className="auth-input"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label className="auth-label" htmlFor="password">Password</label>
          <Input
            variant="unstyled"
            type="password"
            id="password"
            placeholder="Password"
            className="auth-input"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button variant="unstyled" size="none" type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>
        <button type="button" className="auth-link auth-link-btn" onClick={onNavigateToSignUp}>
          New to KINO? <span>Join the Club</span>
        </button>
      </Card>
    </div>
  )
}
