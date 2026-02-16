import React, { useState } from 'react';
import axios from 'axios'; // Import the messenger
import { useNavigate } from 'react-router-dom';
import './Auth.css'; // Assuming you have styles here

const SignUp = ({ onNavigateToSignIn }) => {
  const navigate = useNavigate();
  
  // 1. State to hold the user's input
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password_confirmation: '' // Laravel needs this for confirmation!
  });

  const [error, setError] = useState('');

  // 2. Handle typing in the boxes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // 3. Handle the Button Click
  const handleSignUp = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    try {
      // THE MOMENT OF TRUTH: Send data to Laravel
      const response = await axios.post('http://127.0.0.1:8000/api/register', {
        name: formData.username,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.password // We just send the same pass twice for now
      });

      console.log('Success:', response.data);
      
      // Save the token (The ID Card) so they stay logged in
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      // Pass user data to App's handleLogin (aliased as onSignUp here)
      if (onSignUp) {
        // Pass object to maintain compatibility with new handleLogin logic that checks for object/string
        onSignUp({
          username: formData.username,
          email: formData.email
        });
      } else {
        // Fallback if onSignUp prop is missing (shouldn't happen based on App.jsx)
        navigate('/dashboard');
      }
      
    } catch (err) {
      // If Laravel complains (e.g., email taken), show it
      console.error(err);
      if (err.response && err.response.data.errors) {
        // Show the first error Laravel sends back
        setError(Object.values(err.response.data.errors)[0][0]);
      } else {
        setError('Something went wrong. Is the backend running?');
      }
    }
  };

  return (
    <div className="auth-container">
      <img 
        src="https://image.tmdb.org/t/p/w1280/hZkgoQYus5vegHoetLkCJzb17zJ.jpg" 
        alt="Fight Club Movie Scene" 
        className="auth-bg-image"
        loading="lazy"
        onError={(e) => { e.target.style.display = 'none' }}
      />
      <div className="auth-card">
        <h2 className="auth-title">Create Account</h2>
        
        {error && <div style={{color: '#ff4444', marginBottom: '15px', background: 'rgba(255, 0, 0, 0.1)', padding: '10px', borderRadius: '8px'}}>{error}</div>}

        <form onSubmit={handleSignUp}>
          <input 
            type="text" 
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Username" 
            className="auth-input"
            required
          />
          
          <input 
            type="email" 
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email" 
            className="auth-input"
            required
          />
          
          <input 
            type="password" 
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password" 
            className="auth-input"
            required
          />

          <button type="submit" className="auth-btn">Join KINO</button>
        </form>

        <div className="auth-link" onClick={onNavigateToSignIn} style={{cursor: 'pointer'}}>
          Already have an account? <span>Sign In</span>
        </div>
      </div>
    </div>
  );
};

export default SignUp;