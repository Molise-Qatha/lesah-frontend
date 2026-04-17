import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Login.css';

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';
    const url = `${API_BASE}/api/v1/auth/login`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      
      if (response.ok) {
        // Store tokens
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('refresh_token', data.refresh_token);
        
        // Fetch the current user profile to get role and other details
        try {
          const userRes = await fetch(`${API_BASE}/api/v1/users/me`, {
            headers: { 'Authorization': `Bearer ${data.access_token}` }
          });
          if (userRes.ok) {
            const userData = await userRes.json();
            // Store user object with role
            localStorage.setItem('user', JSON.stringify(userData));
          } else {
            console.warn('Could not fetch user profile after login');
          }
        } catch (profileErr) {
          console.warn('Failed to fetch user profile:', profileErr);
        }
        
        const from = location.state?.from || '/';
        navigate(from);
      } else {
        setError(data.detail || 'Invalid email or password');
      }
    } catch (err) {
      setError('Unable to connect to the server. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <h1>Login to LeSAH</h1>
          <p>Welcome back</p>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" name="email" placeholder="student@university.ac.ls" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" name="password" placeholder="Enter your password" value={formData.password} onChange={handleChange} required />
            </div>
            <div className="form-options">
              <label className="checkbox-label">
                <input type="checkbox" /> Remember me
              </label>
              <Link to="/forgot-password" className="forgot-link">Forgot Password?</Link>
            </div>
            <button type="submit" className="auth-btn" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          <div className="auth-footer">
            <p>Don't have an account? <Link to="/register">Sign Up</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
