import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authApi } from '../services/api'
import { Button } from './ui/button'
import { Card } from './ui/card'
import { Input } from './ui/input'
import './Auth.css'

const SignUp = ({ onNavigateToSignIn, onSignUp }) => {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password_confirmation: ''
  })
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
    <div className="auth-container">
      <img
        src="https://image.tmdb.org/t/p/w1280/hZkgoQYus5vegHoetLkCJzb17zJ.jpg"
        alt="Fight Club Movie Scene"
        className="auth-bg-image"
        loading="lazy"
        onError={(e) => { e.target.style.display = 'none' }}
      />
      <Card className="auth-card">
        <h2 className="auth-title">Create Account</h2>
        <p className="auth-subtitle">Join the club. Build your collection.</p>
        {error && <div className="auth-error" role="alert">{error}</div>}

        <form onSubmit={handleSignUp}>
          <Input
            variant="unstyled"
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Username"
            className="auth-input"
            required
          />

          <Input
            variant="unstyled"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="auth-input"
            required
          />

          <Input
            variant="unstyled"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="auth-input"
            required
          />

          <Input
            variant="unstyled"
            type="password"
            name="password_confirmation"
            value={formData.password_confirmation}
            onChange={handleChange}
            placeholder="Confirm Password"
            className="auth-input"
            required
          />

          <Button variant="unstyled" size="none" type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Creating...' : 'Join KINO'}
          </Button>
        </form>

        <div className="auth-link" onClick={onNavigateToSignIn} style={{ cursor: 'pointer' }}>
          Already have an account? <span>Sign In</span>
        </div>
      </Card>
    </div>
  )
}

export default SignUp
