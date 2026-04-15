import React from 'react';
import { Link } from 'react-router-dom';
import './Services.css';

// Import local images from assets folder
import accommodationImg from '../assets/images/accommodation-bg.jpg';
import loansImg from '../assets/images/loans-bg.jpg';
import deliveryImg from '../assets/images/delivery-bg.jpg';

function Services() {
  const services = [
    {
      title: "Accommodation",
      description: "Premium student housing located within walking distance of campus, featuring 24/7 security and high-speed fiber.",
      path: "/accommodation",
      buttonText: "Explore Listings",
      bgImage: accommodationImg,
      overlayColor: "rgba(0, 0, 0, 0.65)"
    },
    {
      title: "Student Loans",
      description: "Flexible financial solutions with competitive interest rates tailored for academic success and peace of mind.",
      path: "/loans",
      buttonText: "Check Eligibility",
      bgImage: loansImg,
      overlayColor: "rgba(0, 0, 0, 0.7)"
    },
    {
      title: "Asset Delivery",
      description: "Safe and secure transport of your academic materials and personal belongings across the country with real-time tracking.",
      path: "/delivery",
      buttonText: "Request Delivery",
      bgImage: deliveryImg,
      overlayColor: "rgba(0, 0, 0, 0.65)"
    }
  ];

  return (
    <section id="services-section" className="services">
      <div className="container">
        <h2 className="section-title">Our Services</h2>
        <div className="services-grid">
          {services.map((service, index) => (
            <Link 
              key={index} 
              to={service.path}
              className="service-card"
              style={{
                backgroundImage: `linear-gradient(${service.overlayColor}, ${service.overlayColor}), url(${service.bgImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            >
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <div className="service-link">
                {service.buttonText} →
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Services;



