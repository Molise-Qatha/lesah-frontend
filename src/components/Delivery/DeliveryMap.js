// src/components/Delivery/DeliveryMap.js
import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default icon paths
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const studentIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const driverIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

function MapUpdater({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.setView(center, 14);
  }, [center, map]);
  return null;
}

const DeliveryMap = ({ userLocation, drivers, loading }) => {
  if (loading) {
    return <div className="map-loading">Loading map...</div>;
  }

  if (!userLocation) {
    return <div className="map-loading">Getting your location...</div>;
  }

  return (
    <div className="live-map">
      <MapContainer
        center={[userLocation.lat, userLocation.lng]}
        zoom={14}
        style={{ height: '400px', width: '100%', borderRadius: '16px' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
        <MapUpdater center={[userLocation.lat, userLocation.lng]} />
        <Marker position={[userLocation.lat, userLocation.lng]} icon={studentIcon}>
          <Popup>
            📍 Your location<br />
            Roma, Lesotho
          </Popup>
        </Marker>
        {drivers.map((driver) => (
          <Marker key={driver.id} position={[driver.lat, driver.lng]} icon={driverIcon}>
            <Popup>
              <strong>{driver.name}</strong><br />
              🚗 {driver.vehicle_type}<br />
              📍 {driver.distance} away<br />
              ⏱️ ETA: {driver.eta}<br />
              ⭐ {driver.rating}/5
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default DeliveryMap;