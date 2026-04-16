import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './Delivery.css';

import { useNearbyDrivers } from '../hooks/useNearbyDrivers';
import { deliveryService } from '../services/deliveryService';
import DeliveryForm from '../components/Delivery/DeliveryForm';
import DriverRegistrationForm from '../components/Delivery/DriverRegistrationForm';
import TrackingResult from '../components/Delivery/TrackingResult';
import DeliveryMap from '../components/Delivery/DeliveryMap';

// Fix Leaflet default icon paths
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const ROMA_COORDINATES = { lat: -29.4422, lng: 27.7148 };

function Delivery() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [activeForm, setActiveForm] = useState('student'); // 'student' or 'provider'
  const [userLocation, setUserLocation] = useState(ROMA_COORDINATES);
  const [trackingId, setTrackingId] = useState('');
  const [trackedDelivery, setTrackedDelivery] = useState(null);
  const [isTrackingLoading, setIsTrackingLoading] = useState(false);
  const [recentRequests, setRecentRequests] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Auth check
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    setIsLoggedIn(!!token);
  }, []);

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => setUserLocation(ROMA_COORDINATES)
      );
    }
  }, []);

  // Load recent requests from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentDeliveries');
    if (saved) setRecentRequests(JSON.parse(saved));
  }, []);

  // Fetch nearby drivers using React Query
  const { data: nearbyDrivers = [], isLoading: driversLoading } = useNearbyDrivers(
    userLocation.lat,
    userLocation.lng,
    true
  );

  const saveToRecent = (request) => {
    const updated = [request, ...recentRequests.slice(0, 4)];
    setRecentRequests(updated);
    localStorage.setItem('recentDeliveries', JSON.stringify(updated));
  };

  const requireAuth = (action) => {
    if (!isLoggedIn) {
      toast.error('Please log in to continue');
      navigate('/login', { state: { from: '/delivery', action } });
      return false;
    }
    return true;
  };

  const handleRequestDelivery = () => {
    if (!requireAuth('request')) return;
    setActiveForm('student');
    setShowModal(true);
  };

  const handleBecomeDriver = () => {
    if (!requireAuth('driver')) return;
    setActiveForm('provider');
    setShowModal(true);
  };

  const handleStudentSubmit = async (formData) => {
    try {
      const result = await deliveryService.createRequest(formData);
      saveToRecent({ id: result.id, ...formData, status: 'pending', createdAt: new Date().toISOString() });
      toast.success(`Request submitted! Tracking ID: ${result.id}`);
      setShowModal(false);
      queryClient.invalidateQueries(['deliveryRequests']); // If you have a requests list query
    } catch (error) {
      toast.error(error.message || 'Failed to submit request');
    }
  };

  const handleDriverSubmit = async (formData) => {
    try {
      const result = await deliveryService.registerDriver(formData);
      toast.success('Registration successful! We will review your details.');
      setShowModal(false);
    } catch (error) {
      toast.error(error.message || 'Registration failed');
    }
  };

  const handleTrackDelivery = async (e) => {
    e.preventDefault();
    if (!trackingId.trim()) {
      toast.error('Please enter a tracking ID');
      return;
    }
    setIsTrackingLoading(true);
    try {
      const data = await deliveryService.getTrackingStatus(trackingId);
      setTrackedDelivery(data);
    } catch (error) {
      toast.error('Tracking ID not found');
      setTrackedDelivery(null);
    } finally {
      setIsTrackingLoading(false);
    }
  };

  return (
    <div className="delivery-page">
      <Toaster position="top-center" reverseOrder={false} />
      
      <div className="delivery-container">
        {/* Hero Section */}
        <div className="delivery-hero">
          <div className="hero-icon">🚚</div>
          <h1 className="delivery-title">
            Fast & Reliable <span className="highlight">Student Delivery</span>
          </h1>
          <p className="delivery-subtitle">
            The academic concierge service designed for the modern campus lifestyle.
          </p>
          <div className="hero-buttons">
            <button className="btn-primary" onClick={handleRequestDelivery}>
              Request Delivery
            </button>
            <button className="btn-secondary" onClick={handleBecomeDriver}>
              Become a Driver
            </button>
          </div>
          <div className="hero-stats">
            <div className="stat-card">
              <span className="stat-value">{nearbyDrivers.length || '...'}</span>
              <span className="stat-label">Active Drivers</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">&lt;20min</span>
              <span className="stat-label">Avg. Delivery</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">4.9★</span>
              <span className="stat-label">Rating</span>
            </div>
          </div>
        </div>

        {/* Live Map Section */}
        <div className="live-map-section">
          <h2>📍 Live Map - Nearby Drivers</h2>
          <p>See available drivers in Roma</p>
          <DeliveryMap 
            userLocation={userLocation} 
            drivers={nearbyDrivers} 
            loading={driversLoading} 
          />
          <p className="map-note">
            ✨ {nearbyDrivers.length} drivers available nearby<br />
            🏫 <strong>National University of Lesotho (NUL) area</strong>
          </p>
        </div>

        {/* Features Cards */}
        <div className="delivery-features">
          <div className="delivery-card"><div className="feature-icon">⚡</div><h3>Fast Delivery</h3><p>Door-to-door in under 20 minutes</p></div>
          <div className="delivery-card"><div className="feature-icon">📍</div><h3>Real-time Location</h3><p>Watch your delivery move live</p></div>
          <div className="delivery-card"><div className="feature-icon">🛡️</div><h3>Safe & Trusted</h3><p>All couriers are verified students</p></div>
          <div className="delivery-card"><div className="feature-icon">💰</div><h3>Affordable</h3><p>Student-friendly rates</p></div>
        </div>

        {/* Tracking Section */}
        <div className="tracking-section">
          <h2>Track Your Delivery</h2>
          <p>Enter your tracking ID to see real-time status</p>
          <form className="tracking-form" onSubmit={handleTrackDelivery}>
            <input
              type="text"
              placeholder="Tracking ID (e.g., DEL123456)"
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
            />
            <button type="submit" disabled={isTrackingLoading}>
              {isTrackingLoading ? 'Tracking...' : 'Track Package'}
            </button>
          </form>
          {trackedDelivery && <TrackingResult delivery={trackedDelivery} />}
        </div>

        {/* Recent Requests */}
        {recentRequests.length > 0 && (
          <div className="recent-requests">
            <h2>Recent Delivery Requests</h2>
            <div className="requests-list">
              {recentRequests.map((req, idx) => (
                <div key={idx} className="request-item">
                  <div className="request-icon">📦</div>
                  <div className="request-details">
                    <p><strong>From:</strong> {req.pickup_location}</p>
                    <p><strong>To:</strong> {req.dropoff_location}</p>
                    <p><strong>Item:</strong> {req.item_description?.substring(0, 50)}...</p>
                    <small>Status: {req.status || 'Pending'}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Become Driver CTA */}
        <div className="become-driver">
          <div className="driver-content">
            <div className="driver-icon">🚚</div>
            <h2>Earn While You Study on Campus</h2>
            <p>Join our community of student couriers making money on their own schedule.</p>
            <ul className="driver-benefits">
              <li>✓ Flexible hours around your classes</li>
              <li>✓ Instant payouts after every delivery</li>
              <li>✓ Exclusive campus gear & rewards</li>
            </ul>
            <button className="driver-btn" onClick={handleBecomeDriver}>
              Apply to Become Driver
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setShowModal(false)}>✕</button>
            <div className="form-toggle">
              <button
                className={activeForm === 'student' ? 'active' : ''}
                onClick={() => setActiveForm('student')}
              >
                📦 Request Delivery
              </button>
              <button
                className={activeForm === 'provider' ? 'active' : ''}
                onClick={() => setActiveForm('provider')}
              >
                🚚 Become a Driver
              </button>
            </div>
            {activeForm === 'student' && (
              <DeliveryForm onSubmit={handleStudentSubmit} onCancel={() => setShowModal(false)} />
            )}
            {activeForm === 'provider' && (
              <DriverRegistrationForm onSubmit={handleDriverSubmit} onCancel={() => setShowModal(false)} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Delivery;