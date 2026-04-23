import React from 'react';
import { Link } from 'react-router-dom';
import './Hero.css';

function Hero() {
  return (
    <section className="hero-new">
      <div className="hero-new-container">
        {/* LEFT TEXT SIDE */}
        <div className="hero-new-text">
          <span className="hero-pill">Your All-in-One Student Support Platform</span>

          <h1 className="hero-headline">
            Everything students need — in one place.
          </h1>

          <p className="hero-subtitle">
            Find accommodation, student loans, and delivery services across Lesotho — fast, simple, and reliable.
          </p>

          <div className="hero-notice">
            ⚠️ <strong>Note:</strong> You must register before submitting any request.
          </div>

          <div className="hero-actions">
            <Link to="/register" className="hero-cta-btn">
              Get Started (Register First)
            </Link>
            <Link to="/learn-more" className="hero-secondary-link">
              Learn how it works →
            </Link>
          </div>
        </div>

        {/* RIGHT IMAGE PLACEHOLDER */}
        <div className="hero-image-placeholder">
          <div className="placeholder-content">
            <div className="placeholder-icon">📱</div>
            <p className="placeholder-label">
              Image Placeholder<br />
              (Phone Mockup + Student Photo will be added here later)
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
