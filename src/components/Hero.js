import React from 'react';
import { Link } from 'react-router-dom';
import './Hero.css';

// Import local background image
import heroBg from '../assets/images/hero-bg.jpg';

function Hero() {
  const scrollToServices = () => {
    const servicesSection = document.getElementById('services-section');
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      className="hero" 
      style={{
        backgroundImage: `linear-gradient(135deg, rgba(102, 126, 234, 0.7), rgba(118, 75, 162, 0.75)), url(${heroBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="hero-container">
        <h1 className="hero-title">
          Welcome to <span className="brand-name">LeSAH</span>
          <br />
          <span className="hero-subtitle">Your All-in-One Student Hub in Lesotho</span>
        </h1>
        <p className="hero-description">
          Join 1,200+ students from NUL, Limkokwing & more who are already saving time and money.
        </p>
        
        {/* Service Tags as Clickable Buttons */}
        <div className="service-tags">
          <Link to="/accommodation" className="service-tag">
            🏠 Accommodation
          </Link>
          <Link to="/loans" className="service-tag">
            💰 Student Loans
          </Link>
          <Link to="/delivery" className="service-tag">
            🚚 Asset Delivery
          </Link>
          <button 
            onClick={() => {
              const gameSection = document.getElementById('game-section');
              if (gameSection) {
                gameSection.scrollIntoView({ behavior: 'smooth' });
              }
            }} 
            className="service-tag"
          >
            🎮 Lilotho Game
          </button>
        </div>
        
        <div className="hero-buttons">
          <button onClick={scrollToServices} className="btn-primary">Get Started Now</button>
          <Link to="/learn-more" className="btn-secondary">Learn More</Link>
        </div>
      </div>
    </section>
  );
}

export default Hero;
