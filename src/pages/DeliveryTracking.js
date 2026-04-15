import React, { useState } from 'react';
import './DeliveryTracking.css';

function DeliveryTracking() {
  const [trackingId, setTrackingId] = useState('');
  const [delivery, setDelivery] = useState(null);
  const [tracked, setTracked] = useState(false);

  const trackDelivery = (e) => {
    e.preventDefault();
    // Simulate tracking data
    setDelivery({
      id: trackingId,
      status: 'in_transit',
      currentLocation: 'City Center Distribution Hub',
      estimatedDelivery: '2026-03-26',
      items: [
        { name: 'Textbooks', quantity: 3, weight: '2.5kg' },
        { name: 'Laptop', quantity: 1, weight: '1.8kg' }
      ],
      timeline: [
        { date: '2026-03-24 14:30', status: 'Package picked up', location: 'Campus Pickup Point' },
        { date: '2026-03-24 16:45', status: 'Arrived at sorting facility', location: 'City Center Hub' },
        { date: '2026-03-25 09:00', status: 'In transit', location: 'En route to destination' }
      ]
    });
    setTracked(true);
  };

  return (
    <div className="delivery-tracking">
      <div className="container">
        <div className="tracking-header">
          <h1>Track Your Delivery</h1>
          <p>Enter your tracking ID to see real-time delivery status</p>
        </div>

        <form className="tracking-form" onSubmit={trackDelivery}>
          <input
            type="text"
            placeholder="Enter Tracking ID (e.g., DEL123456)"
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
            required
          />
          <button type="submit" className="track-btn">Track Package</button>
        </form>

        {tracked && delivery && (
          <div className="tracking-results">
            <div className="delivery-status-card">
              <h2>Delivery Status</h2>
              <div className="status-badge in_transit">🚚 In Transit</div>
              <p><strong>Tracking ID:</strong> {delivery.id}</p>
              <p><strong>Current Location:</strong> {delivery.currentLocation}</p>
              <p><strong>Estimated Delivery:</strong> {delivery.estimatedDelivery}</p>
            </div>

            <div className="tracking-timeline">
              <h3>Delivery Timeline</h3>
              {delivery.timeline.map((event, index) => (
                <div key={index} className="timeline-item">
                  <div className="timeline-dot"></div>
                  <div className="timeline-content">
                    <div className="timeline-date">{event.date}</div>
                    <div className="timeline-status">{event.status}</div>
                    <div className="timeline-location">{event.location}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="package-details">
              <h3>Package Details</h3>
              {delivery.items.map((item, index) => (
                <div key={index} className="package-item">
                  <span>{item.name}</span>
                  <span>Quantity: {item.quantity}</span>
                  <span>Weight: {item.weight}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DeliveryTracking;