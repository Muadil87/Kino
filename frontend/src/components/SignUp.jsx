import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authApi } from '../services/api'
import { Button } from './ui/button'
import { Card } from './ui/card'
import { Input } from './ui/input'
import Icon from './ui/Icon'
import './Auth.css'

const SignUp = ({ onNavigateToSignIn, onSignUp }) => {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password_confirmation: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSignUp = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const data = await authApi.register({
        name: formData.username,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.password_confirmation
      })

      authApi.saveToken(data.token)

      if (onSignUp) {
        onSignUp(data.user)
      } else {
        navigate('/dashboard')
      }
    } catch (err) {
      if (err.response?.data?.errors) {
        setError(Object.values(err.response.data.errors)[0][0])
      } else {
        setError(err.response?.data?.message || 'Sign up failed')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container auth-signup">
      <div className="auth-bg-layer" aria-hidden="true" />

      <main className="auth-shell">
        <section className="auth-story auth-gallery-story">
          <div className="auth-poster-wall" aria-hidden="true">
            <span style={{ backgroundImage: 'url(https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg)' }} />
            <span style={{ backgroundImage: 'url(https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg)' }} />
            <span style={{ backgroundImage: 'url(https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg)' }} />
            <span style={{ backgroundImage: 'url(https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg)' }} />
          </div>
          <p className="auth-kicker">Join KINO</p>
          <h1>Build your <span>cinematic</span> identity.</h1>
          <p className="auth-story-copy">
            Create your account and start tracking, rating, and discovering films
            that truly matter to you.
          </p>
          <div className="auth-stat-strip">
            <span><Icon name="cinema" size={24} tone="gold" /><strong>10K+</strong><small>Films</small></span>
            <span><Icon name="user" size={24} tone="gold" /><strong>25K+</strong><small>Members</small></span>
            <span><Icon name="star" size={24} tone="gold" /><strong>100K+</strong><small>Ratings</small></span>
            <span><Icon name="watchlist" size={24} tone="gold" /><strong>Unlimited</strong><small>Watchlists</small></span>
          </div>
          <p className="auth-footnote">KINO is powered by <strong>TMDB</strong><i />Trusted by cinephiles worldwide.</p>
        </section>

        <Card className="auth-card auth-panel">
          <h2 className="auth-title"><Icon name="user" size={24} tone="gold" />Create Account</h2>
          <p className="auth-subtitle">Join the club. Build your collection.</p>
          {error && <div className="auth-error" role="alert">{error}</div>}

          <form onSubmit={handleSignUp}>
            <label className="auth-label" htmlFor="signup-username">Username</label>
            <Input
              variant="unstyled"
              type="text"
              id="signup-username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Choose a username"
              className="auth-input"
              required
            />

            <label className="auth-label" htmlFor="signup-email">Email</label>
            <Input
              variant="unstyled"
              type="email"
              id="signup-email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="auth-input"
              required
            />

            <label className="auth-label" htmlFor="signup-password">Password</label>
            <div className="auth-password-field">
              <Input
                variant="unstyled"
                type={showPassword ? 'text' : 'password'}
                id="signup-password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                className="auth-input"
                required
              />
              <button type="button" className="auth-eye" onClick={() => setShowPassword((value) => !value)} aria-label="Toggle password visibility">
                <Icon name="eye" size={16} tone="gold" />
              </button>
            </div>

            <label className="auth-label" htmlFor="signup-password-confirm">Confirm Password</label>
            <div className="auth-password-field">
              <Input
                variant="unstyled"
                type={showConfirmPassword ? 'text' : 'password'}
                id="signup-password-confirm"
                name="password_confirmation"
                value={formData.password_confirmation}
                onChange={handleChange}
                placeholder="Confirm your password"
                className="auth-input"
                required
              />
              <button type="button" className="auth-eye" onClick={() => setShowConfirmPassword((value) => !value)} aria-label="Toggle password visibility">
                <Icon name="eye" size={16} tone="gold" />
              </button>
            </div>

            <label className="auth-check auth-terms">
              <input type="checkbox" />
              I agree to the <span>Terms of Service</span> and <span>Privacy Policy</span>
            </label>

            <Button variant="unstyled" size="none" type="submit" className="auth-btn" disabled={loading}>
              {loading ? 'Creating...' : 'Join KINO'}
            </Button>
          </form>

          <div className="auth-divider"><span>or continue with</span></div>
          <div className="auth-social-grid">
            <button type="button" aria-label="Continue with Google"><span className="google-logo">G</span></button>
            <button type="button" aria-label="Continue with Apple"><span className="apple-logo">Apple</span></button>
            <button type="button" aria-label="Continue with KINO"><span className="kino-logo">K</span></button>
          </div>

          <button type="button" className="auth-link auth-link-btn" onClick={onNavigateToSignIn}>
            Already have an account? <span>Sign In</span>
          </button>
        </Card>
      </main>
    </div>
  )
}

export default SignUp
