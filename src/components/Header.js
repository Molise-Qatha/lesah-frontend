import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Header.css';
import logo from '../assets/images/logo.png';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    setIsLoggedIn(!!token);
    if (token) {
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          setUser(JSON.parse(userData));
        } catch (e) {
          console.warn('Invalid user data');
        }
      }
    } else {
      setUser(null);
    }
  }, [location]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const scrollToGame = () => {
    setIsMenuOpen(false);
    const gameSection = document.getElementById('game-section');
    if (gameSection) {
      gameSection.scrollIntoView({ behavior: 'smooth' });
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
    setUser(null);
    setIsMenuOpen(false);
    navigate('/');
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="header">
      <div className="container">
        <nav className="navbar">
          <Link to="/" className="logo" onClick={closeMenu}>
            <img src={logo} alt="LeSAH Logo" className="logo-image" />
            <span className="logo-text">LeSAH</span>
          </Link>

          <button
            className="mobile-menu-btn"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? '✕' : '☰'}
          </button>

          {/* Mobile menu overlay */}
          <div
            className={`nav-overlay ${isMenuOpen ? 'active' : ''}`}
            onClick={closeMenu}
          />

          <div className={`nav-content ${isMenuOpen ? 'active' : ''}`}>
            {/* Close button inside mobile menu */}
            <button className="mobile-menu-close" onClick={closeMenu}>
              ✕
            </button>

            <ul className="nav-links">
              <li><Link to="/accommodation" onClick={closeMenu}>Accommodation</Link></li>
              <li><Link to="/loans" onClick={closeMenu}>Loans</Link></li>
              <li><Link to="/delivery" onClick={closeMenu}>Delivery</Link></li>
              <li><button className="nav-link-btn" onClick={scrollToGame}>Game</button></li>
              <li><Link to="/contact" onClick={closeMenu}>Contact</Link></li>
            </ul>

            <div className="auth-section">
              {isLoggedIn ? (
                <div className="user-menu">
                  <span className="user-name">👤 {user?.full_name?.split(' ')[0] || 'User'}</span>
                  <button onClick={handleLogout} className="logout-btn">
                    Logout
                  </button>
                </div>
              ) : (
                <div className="auth-buttons">
                  <Link to="/login" className="login-btn" onClick={closeMenu}>Login</Link>
                  <Link to="/register" className="register-btn" onClick={closeMenu}>Sign Up</Link>
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
