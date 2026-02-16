import React from 'react'
import './Auth.css'

export default function SignIn({ onNavigateToSignUp, onLogin }) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleSubmit = (e) => {
    e.preventDefault()
    // ⚡️ THIS IS THE FIX: Pass the email back to App.jsx 
    if (email && password) { 
      onLogin(email); 
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
      <div className="auth-card">
        <h2 className="auth-title">Welcome Back</h2>
        <form onSubmit={handleSubmit}>
          <input 
            type="email" 
            id="email" 
            placeholder="Email" 
            className="auth-input"
            required 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input 
            type="password" 
            id="password" 
            placeholder="Password" 
            className="auth-input"
            required 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="auth-btn">Sign In</button>
        </form>
        <div className="auth-link" onClick={onNavigateToSignUp} style={{cursor: 'pointer'}}>
          New to KINO? <span>Join the Club</span>
        </div>
      </div>
    </div>
  )
}
