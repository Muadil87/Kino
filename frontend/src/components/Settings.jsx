import React, { useState } from 'react'
import { Button } from './ui/button'
import { Card } from './ui/card'
import { Input } from './ui/input'
import './Settings.css'

const Settings = ({ username, setUsername }) => {
  const [newUsername, setNewUsername] = useState(username)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleSave = (e) => {
    e.preventDefault()
    setError('')
    setMessage('')

    if (newUsername.trim() === '') {
      setError('Username cannot be empty.')
      return
    }

    if (password && password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setUsername(newUsername)
    localStorage.setItem('kino_username', newUsername)
    setMessage('Profile updated successfully!')
    setPassword('')
    setConfirmPassword('')
  }

  return (
    <div className="settings-page">
      <div className="settings-container">
        <Card className="settings-card">
          <h1 className="settings-title">Account Settings</h1>

          <form className="settings-form" onSubmit={handleSave}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <Input
                variant="unstyled"
                type="text"
                id="username"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className="form-input"
                placeholder="Enter your username"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">New Password (Optional)</label>
              <Input
                variant="unstyled"
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                placeholder="********"
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <Input
                variant="unstyled"
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="form-input"
                placeholder="********"
              />
            </div>

            {error && <div className="error-message">{error}</div>}
            {message && <div className="success-message">{message}</div>}

            <div className="form-actions">
              <Button variant="unstyled" size="none" type="submit" className="btn-primary save-btn">Save Changes</Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}

export default Settings
