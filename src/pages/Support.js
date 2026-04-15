import React, { useState } from 'react';
import './LegalPages.css';

function Support() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Support ticket:', formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 3000);
  };

  return (
    <div className="legal-page">
      <div className="container">
        <div className="legal-container">
          <h1>Support Center</h1>
          <p>How can we help you today?</p>
          
          <div className="support-grid">
            <div className="faq-section-support">
              <h2>Frequently Asked Questions</h2>
              <div className="faq-item-support">
                <h3>How do I track my delivery?</h3>
                <p>Use the tracking ID provided in your confirmation email on the Delivery page.</p>
              </div>
              <div className="faq-item-support">
                <h3>How long does loan approval take?</h3>
                <p>Loan eligibility assessments are reviewed within 2-3 business days.</p>
              </div>
              <div className="faq-item-support">
                <h3>Can I cancel my accommodation booking?</h3>
                <p>Contact our support team within 24 hours of booking for cancellation assistance.</p>
              </div>
              <div className="faq-item-support">
                <h3>How do I become a delivery driver?</h3>
                <p>Visit the Delivery page and click "Register as Driver" to apply.</p>
              </div>
            </div>
            
            <div className="contact-form-support">
              <h2>Submit a Support Ticket</h2>
              {submitted ? (
                <div className="success-message">
                  <div className="success-icon">✓</div>
                  <h3>Ticket Submitted!</h3>
                  <p>We'll get back to you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  <input
                    type="text"
                    name="subject"
                    placeholder="Subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  />
                  <textarea
                    name="message"
                    placeholder="Describe your issue..."
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    required
                  ></textarea>
                  <button type="submit" className="submit-btn">Submit Ticket</button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Support;