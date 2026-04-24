import React from 'react';
import { Link } from 'react-router-dom';
import './Hero.css';
import heroMockup from '../assets/images/hero-student-mockup.png';

function Hero() {
  return (
    <section className="hero-refined">
      <div className="hero-refined-grid">
        <div className="hero-refined-text">
          <p className="hero-refined-label">Your all-in-one student support platform</p>

          <h1 className="hero-refined-headline">
            Everything students need in one place.
          </h1>

          <p className="hero-refined-subtitle">
            Find accommodation, student loans, and delivery services across Lesotho — fast, simple, and reliable.
          </p>

          <div className="hero-refined-trust">
            <span>Accommodation</span>
            <span>Student Loans</span>
            <span>Delivery</span>
          </div>

          <div className="hero-refined-action">
            <Link to="/register" className="hero-refined-cta">
              Get Started
            </Link>

            <Link to="/services" className="hero-refined-secondary">
              Explore Services
            </Link>
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
