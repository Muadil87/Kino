import React from 'react'
import './Auth.css'

export default function SignIn({ onNavigateToSignUp, onLogin }) {
  const handleSubmit = (e) => {
    e.preventDefault()
    onLogin()
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Sign In</h2>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" placeholder="Enter your email" required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" placeholder="Enter your password" required />
          </div>
          <button type="submit" className="auth-btn">Sign In</button>
        </form>
        <p className="auth-footer">
          Don't have an account? <span className="auth-link" onClick={onNavigateToSignUp}>Sign Up</span>
        </p>
      </div>
    </div>
  )
}
