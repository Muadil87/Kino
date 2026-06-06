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
  const [showPassword, setShowPassword] = React.useState(false)
  const [error, setError] = React.useState('')
  const [loading, setLoading] = React.useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const data = await authApi.login({ email, password })
      authApi.saveSession(data.user, data.token)
      onLogin(data.user)
    } catch (err) {
      setError(err.response?.data?.message || 'Sign in failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container auth-signin">
      <div className="auth-bg-layer" aria-hidden="true" />

      <main className="auth-shell">
        <section className="auth-story">
          <p className="auth-kicker">Welcome Back to KINO</p>
          <h1>Good to see you <span>again.</span></h1>
          <p className="auth-story-copy">
            Sign in to continue curating your cinema. Your watchlists, ratings,
            and reviews are waiting for you.
          </p>
          <div className="auth-feature-strip">
            <span><Icon name="cinema" size={24} tone="gold" />Track<small>the films you love</small></span>
            <span><Icon name="star" size={24} tone="gold" />Rate<small>what matters</small></span>
            <span><Icon name="collections" size={24} tone="gold" />Review<small>share your voice</small></span>
            <span><Icon name="watchlist" size={24} tone="gold" />Watchlist<small>never miss a film</small></span>
          </div>
          <p className="auth-footnote">KINO is powered by <strong>TMDB</strong><i />Trusted by cinephiles worldwide.</p>
        </section>

        <Card className="auth-card auth-panel">
          <h2 className="auth-title"><Icon name="cinema" size={24} tone="gold" />Sign In</h2>
          <p className="auth-subtitle">Welcome back! Please sign in to your account.</p>
          {error && <div className="auth-error" role="alert">{error}</div>}

          <form onSubmit={handleSubmit}>
            <label className="auth-label" htmlFor="email">Email</label>
            <Input
              variant="unstyled"
              type="email"
              id="email"
              placeholder="Enter your email"
              className="auth-input"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label className="auth-label" htmlFor="password">Password</label>
            <div className="auth-password-field">
              <Input
                variant="unstyled"
                type={showPassword ? 'text' : 'password'}
                id="password"
                placeholder="Enter your password"
                className="auth-input"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button type="button" className="auth-eye" onClick={() => setShowPassword((value) => !value)} aria-label="Toggle password visibility">
                <Icon name="eye" size={16} tone="gold" />
              </button>
            </div>

            <div className="auth-row">
              <label className="auth-check"><input type="checkbox" />Remember me</label>
              <button type="button" className="auth-mini-link">Forgot password?</button>
            </div>

            <Button variant="unstyled" size="none" type="submit" className="auth-btn" disabled={loading}>
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          <div className="auth-divider"><span>or continue with</span></div>
          <div className="auth-social-grid">
            <button type="button" aria-label="Continue with Google"><span className="google-logo">G</span></button>
            <button type="button" aria-label="Continue with Apple"><span className="apple-logo">Apple</span></button>
            <button type="button" aria-label="Continue with KINO"><span className="kino-logo">K</span></button>
          </div>

          <button type="button" className="auth-link auth-link-btn" onClick={onNavigateToSignUp}>
            New to KINO? <span>Join the Club</span>
          </button>
        </Card>
      </main>
    </div>
  )
}
