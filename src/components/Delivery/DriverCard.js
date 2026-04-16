// src/components/Delivery/DriverCard.js
import React from 'react';

const DriverCard = ({ driver, onSelect }) => {
  return (
    <div className="driver-card" onClick={() => onSelect?.(driver)}>
      <div className="driver-avatar">
        <span role="img" aria-label="driver">🚚</span>
      </div>
      <div className="driver-info">
        <h4>{driver.name}</h4>
        <p className="driver-vehicle">{driver.vehicle_type}</p>
        <div className="driver-meta">
          <span>⭐ {driver.rating}</span>
          <span>📍 {driver.distance}</span>
          <span>⏱️ {driver.eta}</span>
        </div>
      </div>
    </div>
  );
};

export default DriverCard;