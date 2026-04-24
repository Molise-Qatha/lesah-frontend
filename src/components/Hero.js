import React from 'react';
import { Link } from 'react-router-dom';
import './Hero.css';
import heroMockup from '../assets/images/hero-student-mockup.png';

function Hero() {
  return (
    <section className="hero-refined">
      <div className="hero-refined-grid">
        {/* Left text */}
        <div className="hero-refined-text">
          <p className="hero-refined-label">Your All-in-One Student Support Platform</p>

          <h1 className="hero-refined-headline">
            Everything students need<br /> in one place.
          </h1>

          <p className="hero-refined-subtitle">
            Find accommodation, student loans, and delivery services across Lesotho — fast and reliable.
          </p>

          <div className="hero-refined-action">
            <Link to="/register" className="hero-refined-cta">
              Get Started (Register First)
            </Link>
            <span className="hero-refined-note">Free account required to submit requests</span>
          </div>
        </div>

        {/* Right image */}
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
