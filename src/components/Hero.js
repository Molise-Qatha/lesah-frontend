import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Hero.css';
import heroMockup from '../assets/images/hero-student-mockup.png';

function Hero() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    setIsLoggedIn(!!token);
  }, []);

  const scrollToServices = () => {
    const section = document.getElementById('services-section');
    if (section) section.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="hero-refined">
      <div className="hero-refined-grid">
        <div className="hero-refined-text">
          <p className="hero-refined-label">Your all‑in‑one student support platform</p>

          <h1 className="hero-refined-headline">
            Everything students need — in one place.
          </h1>

          <p className="hero-refined-subtitle">
            Find accommodation, student loans, and delivery services across Lesotho — fast, simple, and reliable.
          </p>

          <div className="hero-refined-trust">
            <span>🏠 Accommodation</span>
            <span>💰 Student Loans</span>
            <span>🚚 Delivery</span>
          </div>

          <div className="hero-refined-action">
            {/* Primary CTA changes based on login state */}
            {isLoggedIn ? (
              <button onClick={scrollToServices} className="hero-refined-cta">
                Explore Services
              </button>
            ) : (
              <Link to="/register" className="hero-refined-cta">
                Get Started (Register First)
              </Link>
            )}

            {/* WhatsApp button */}
            <a
              href="https://wa.me/266XXXXXXXXX"   // 👈 Replace with your WhatsApp number
              target="_blank"
              rel="noopener noreferrer"
              className="hero-whatsapp-btn"
            >
              💬 Chat with us on WhatsApp
            </a>
          </div>

          <p className="hero-refined-note">Free account required to submit requests.</p>
        </div>

        <div className="hero-refined-image">
          <img
            src={heroMockup}
            alt="LeSAH app on a student's phone"
            className="hero-refined-img"
          />
        </div>
      </div>
    </section>
  );
}

export default Hero;
