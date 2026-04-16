// src/components/Delivery/TrackingResult.js
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

const packageIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const getStatusIcon = (status) => {
  const icons = {
    pending: '⏳',
    processing: '🔄',
    in_transit: '🚚',
    delivered: '✅',
    cancelled: '❌',
  };
  return icons[status] || '📦';
};

const getStatusText = (status) => {
  const texts = {
    pending: 'Pending',
    processing: 'Processing',
    in_transit: 'In Transit',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
  };
  return texts[status] || status;
};

const TrackingResult = ({ delivery }) => {
  if (!delivery) return null;

  return (
    <div className="tracking-result">
      <div className="tracking-status">
        <div className="status-header">
          <span className="status-icon">{getStatusIcon(delivery.status)}</span>
          <span className={`status-badge ${delivery.status}`}>
            {getStatusText(delivery.status)}
          </span>
        </div>

        {delivery.currentLocation && (
          <div className="tracking-map">
            <MapContainer
              center={[delivery.currentLocation.lat, delivery.currentLocation.lng]}
              zoom={15}
              style={{ height: '200px', width: '100%', borderRadius: '8px' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; OpenStreetMap'
              />
              <Marker
                position={[delivery.currentLocation.lat, delivery.currentLocation.lng]}
                icon={packageIcon}
              >
                <Popup>Package is here</Popup>
              </Marker>
            </MapContainer>
          </div>
        )}

        <div className="status-details">
          <p><strong>Tracking ID:</strong> {delivery.id}</p>
          {delivery.currentLocation?.address && (
            <p><strong>Current Location:</strong> {delivery.currentLocation.address}</p>
          )}
          {delivery.estimatedDelivery && (
            <p><strong>Estimated Delivery:</strong> {delivery.estimatedDelivery}</p>
          )}
          {delivery.driverName && (
            <p><strong>Driver:</strong> {delivery.driverName}</p>
          )}
          {delivery.driverPhone && (
            <p><strong>Driver Contact:</strong> {delivery.driverPhone}</p>
          )}
        </div>

        {delivery.timeline && delivery.timeline.length > 0 && (
          <div className="tracking-timeline">
            <h4>Delivery Timeline</h4>
            {delivery.timeline.map((event, idx) => (
              <div key={idx} className="timeline-item">
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <div className="timeline-date">{event.date}</div>
                  <div className="timeline-status">{event.status}</div>
                  <div className="timeline-location">{event.location}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackingResult;