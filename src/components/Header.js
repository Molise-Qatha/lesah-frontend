import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Header.css';
import logo from '../assets/images/logo.png';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    setIsLoggedIn(!!token);
  }, [location]);

  const scrollToGame = () => {
    const gameSection = document.getElementById('game-section');
    if (gameSection) {
      gameSection.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    } else {
      navigate('/');
      setTimeout(() => {
        const gameSection = document.getElementById('game-section');
        if (gameSection) {
          gameSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    navigate('/');
  };

  return (
    <header className="header">
      <div className="container">
        <nav className="navbar">
          <Link to="/" className="logo">
            <img src={logo} alt="LeSAH Logo" className="logo-image" />
            <span className="logo-text">LeSAH</span>
          </Link>
          
          <button 
            className="mobile-menu-btn" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            ☰
          </button>

          <div className={`nav-content ${isMenuOpen ? 'active' : ''}`}>
            <ul className="nav-links">
              <li><Link to="/accommodation" onClick={() => setIsMenuOpen(false)}>Accommodation</Link></li>
              <li><Link to="/loans" onClick={() => setIsMenuOpen(false)}>Loans</Link></li>
              <li><Link to="/delivery" onClick={() => setIsMenuOpen(false)}>Delivery</Link></li>
              <li><button className="nav-link-btn" onClick={scrollToGame}>Game</button></li>
              <li><Link to="/contact" onClick={() => setIsMenuOpen(false)}>Contact</Link></li>
            </ul>

            <div className="auth-section">
              {isLoggedIn ? (
                <button onClick={handleLogout} className="logout-btn">
                  Logout
                </button>
              ) : (
                <div className="auth-buttons">
                  <Link to="/login" className="login-btn">Login</Link>
                  <Link to="/register" className="register-btn">Sign Up</Link>
                </div>
              )}
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Header;