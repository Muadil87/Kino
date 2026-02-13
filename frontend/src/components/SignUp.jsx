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

      // Redirect to Dashboard
      navigate('/dashboard');
      
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
      <div className="auth-card">
        <h2 className="auth-title">Create Account</h2>
        
        {error && <div style={{color: 'red', marginBottom: '10px'}}>{error}</div>}

        <form onSubmit={handleSignUp} className="auth-form">
          <div className="form-group">
            <label>USERNAME</label>
            <input 
              type="text" 
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Choose a username" 
              required
            />
          </div>
          
          <div className="form-group">
            <label>EMAIL</label>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email" 
              required
            />
          </div>
          
          <div className="form-group">
            <label>PASSWORD</label>
            <input 
              type="password" 
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password" 
              required
            />
          </div>

          <button type="submit" className="auth-btn">SIGN UP</button>
        </form>

        <p className="auth-footer">
          Already have an account? 
          <span onClick={onNavigateToSignIn} className="auth-link"> Sign In</span>
        </p>
      </div>
    </div>
  );
};

export default SignUp;