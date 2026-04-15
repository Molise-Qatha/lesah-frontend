import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Register.css';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    student_id: '',
    institution: '',
    course: '',
    password: '',
    confirm_password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const formatPhoneNumber = (phone) => {
    let cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 8) return '+266' + cleaned;
    if (!phone.startsWith('+')) return '+' + cleaned;
    return phone;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (formData.password !== formData.confirm_password) {
      setError('Passwords do not match');
      return;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    setIsLoading(true);

    const formattedPhone = formatPhoneNumber(formData.phone_number);
    const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';
    const url = `${API_BASE}/api/v1/auth/register`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: formData.full_name,
          email: formData.email,
          phone_number: formattedPhone,
          student_id: formData.student_id,
          institution: formData.institution,
          course: formData.course,
          password: formData.password
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert('Registration successful! Please log in.');
        navigate('/login');
      } else {
        if (data.detail) {
          if (Array.isArray(data.detail)) {
            setError(data.detail.map(err => err.msg).join(', '));
          } else {
            setError(data.detail);
          }
        } else {
          setError('Registration failed. Please try again.');
        }
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Unable to connect to the server. Please check your internet connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <h1>Create Account</h1>
          <p>Join LeSAH today</p>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-row">
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" name="full_name" placeholder="John Doe" value={formData.full_name} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" name="email" placeholder="student@university.ac.ls" value={formData.email} onChange={handleChange} required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Phone Number</label>
                <input type="tel" name="phone_number" placeholder="56613551 or +26612345678" value={formData.phone_number} onChange={handleChange} required />
                <small className="hint">Local 8-digit number will automatically get +266 prefix</small>
              </div>
              <div className="form-group">
                <label>Student ID</label>
                <input type="text" name="student_id" placeholder="STU12345" value={formData.student_id} onChange={handleChange} required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Institution</label>
                <input type="text" name="institution" placeholder="National University of Lesotho" value={formData.institution} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Course/Program</label>
                <input type="text" name="course" placeholder="Bachelor of Commerce" value={formData.course} onChange={handleChange} required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Password</label>
                <input type="password" name="password" placeholder="Create a strong password (8+ chars, upper, lower, number, special)" value={formData.password} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Confirm Password</label>
                <input type="password" name="confirm_password" placeholder="Confirm your password" value={formData.confirm_password} onChange={handleChange} required />
              </div>
            </div>
            <div className="checkbox-group">
              <label className="checkbox-label">
                <input type="checkbox" required />
                <span>I agree to the <Link to="/terms">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link></span>
              </label>
            </div>
            <button type="submit" className="auth-btn" disabled={isLoading}>
              {isLoading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>
          <div className="auth-footer">
            <p>Already have an account? <Link to="/login">Login</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;