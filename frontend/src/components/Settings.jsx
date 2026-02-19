import React, { useState } from 'react';
import './Settings.css';

const Settings = ({ username, setUsername }) => {
  const [newUsername, setNewUsername] = useState(username);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSave = (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (newUsername.trim() === '') {
      setError('Username cannot be empty.');
      return;
    }

    if (password && password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    // Save changes
    setUsername(newUsername);
    localStorage.setItem('kino_username', newUsername);
    setMessage('Profile updated successfully!');
    
    // Clear password fields
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="settings-page">
      <div className="settings-container">
        <h1 className="settings-title">Account Settings</h1>
        
        <form className="settings-form" onSubmit={handleSave}>
          {/* Username Section */}
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              className="form-input"
              placeholder="Enter your username"
            />
          </div>

          {/* Password Section (Simulated) */}
          <div className="form-group">
            <label htmlFor="password">New Password (Optional)</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              placeholder="••••••••"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="form-input"
              placeholder="••••••••"
            />
          </div>

          {/* Feedback Messages */}
          {error && <div className="error-message">{error}</div>}
          {message && <div className="success-message">{message}</div>}

          {/* Actions */}
          <div className="form-actions">
            <button type="submit" className="btn-primary save-btn">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;
