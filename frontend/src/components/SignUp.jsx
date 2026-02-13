import React from 'react'
import './Auth.css'

export default function SignUp({ onNavigateToSignIn, onSignUp }) {
  const handleSubmit = (e) => {
    e.preventDefault()
    onSignUp()
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Create Account</h2>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input type="text" id="username" placeholder="Choose a username" required />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" placeholder="Enter your email" required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" placeholder="Create a password" required />
          </div>
          <button type="submit" className="auth-btn auth-btn-signup">Sign Up</button>
        </form>
        <p className="auth-footer">
          Already have an account? <span className="auth-link" onClick={onNavigateToSignIn}>Sign In</span>
        </p>
      </div>
    </div>
  )
}
