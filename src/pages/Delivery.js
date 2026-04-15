import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './Delivery.css';

const ROMA_COORDINATES = { lat: -29.4422, lng: 27.7148, name: "Roma, Lesotho" };

// Fix default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const driverIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const studentIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34]
});

function MapUpdater({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.setView(center, 14);
  }, [center, map]);
  return null;
}

// Helper: format phone number (add +266 for 8‑digit local numbers)
const formatPhoneNumber = (phone) => {
  let cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 8) return '+266' + cleaned;
  if (!phone.startsWith('+')) return '+' + cleaned;
  return phone;
};

// ------------------ Student Delivery Form (no name/phone) ------------------
const StudentDeliveryForm = ({ onSubmit, onClose }) => {
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropoffLocation, setDropoffLocation] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      pickup_location: pickupLocation,
      dropoff_location: dropoffLocation,
      item_description: e.target.item_description.value.trim(),
      item_weight: e.target.item_weight.value,
      scheduled_time: e.target.delivery_date.value,
    };
    onSubmit(formData);
  };

  return (
    <form className="delivery-form" onSubmit={handleSubmit}>
      <h2>📦 Request Delivery</h2>
      <div className="form-row">
        <input type="text" placeholder="Pickup Location" value={pickupLocation} onChange={(e) => setPickupLocation(e.target.value)} required />
        <input type="text" placeholder="Drop-off Location" value={dropoffLocation} onChange={(e) => setDropoffLocation(e.target.value)} required />
      </div>
      <textarea name="item_description" placeholder="Item Description (e.g., Laptop, Textbooks, Food)" rows="3" required />
      <div className="form-row">
        <select name="item_weight">
          <option value="light">Light (&lt; 2kg)</option>
          <option value="medium">Medium (2-10kg)</option>
          <option value="heavy">Heavy (10-30kg)</option>
          <option value="large">Large (&gt; 30kg)</option>
        </select>
        <input type="date" name="delivery_date" defaultValue={new Date().toISOString().split('T')[0]} />
      </div>
      <div className="checkbox"><input type="checkbox" required /><span>I confirm that the items are legal and properly packaged</span></div>
      <button type="submit" className="submit-btn">Submit Request</button>
    </form>
  );
};

// ------------------ Driver Registration Form ------------------
const DriverRegistrationForm = ({ onSubmit, onClose }) => {
  const [isOnline, setIsOnline] = useState(false);
  const [selectedArea, setSelectedArea] = useState("Roma Central");
  const SERVICE_AREAS = ["Roma Central", "NUL Campus", "Roma Hospital Area", "Roma Taxi Rank", "St. Augustine Area", "Lower Roma", "Upper Roma", "Mazenod", "Mafeteng Road"];

  const handleSubmit = (e) => {
    e.preventDefault();
    const rawPhone = e.target.phone_number.value.trim();
    const formattedPhone = formatPhoneNumber(rawPhone);
    const formData = {
      full_name: e.target.full_name.value.trim(),
      phone_number: formattedPhone,
      vehicle_type: e.target.vehicle_type.value.trim(),
      area_covered: selectedArea,
      vehicle_registration: e.target.vehicle_registration?.value.trim() || "",
      experience_years: parseInt(e.target.experience_years.value, 10),
      is_online: isOnline,
    };
    onSubmit(formData);
  };

  return (
    <form className="delivery-form" onSubmit={handleSubmit}>
      <h2>🚚 Become a Delivery Partner</h2>
      <div className="form-row">
        <input type="text" name="full_name" placeholder="Full Name" required />
        <input type="tel" name="phone_number" placeholder="Phone Number (e.g., 56613551)" required />
      </div>
      <div className="form-row">
        <input type="text" name="vehicle_type" placeholder="Vehicle Type (Car, Van, Motorcycle)" required />
        <input type="text" name="vehicle_registration" placeholder="Vehicle Registration Number" />
      </div>
      <div className="form-row">
        <select name="experience_years">
          <option value="0">Less than 1 year</option><option value="1">1-2 years</option>
          <option value="2">2-3 years</option><option value="3">3-5 years</option><option value="5">5+ years</option>
        </select>
        <select value={selectedArea} onChange={(e) => setSelectedArea(e.target.value)}>
          {SERVICE_AREAS.map(area => <option key={area} value={area}>{area}</option>)}
        </select>
      </div>
      <div className="online-toggle"><label><input type="checkbox" checked={isOnline} onChange={(e) => setIsOnline(e.target.checked)} /> <span>🚀 Available for deliveries immediately</span></label></div>
      <div className="checkbox-group">
        <div className="checkbox"><input type="checkbox" required /><span>I have a valid driver's license</span></div>
        <div className="checkbox"><input type="checkbox" required /><span>I have valid vehicle insurance</span></div>
        <div className="checkbox"><input type="checkbox" required /><span>I know Roma area well</span></div>
      </div>
      <button type="submit" className="submit-btn">Register as Driver</button>
    </form>
  );
};

// ------------------ Main Delivery Component ------------------
function Delivery() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [activeForm, setActiveForm] = useState("student");
  const [userLocation, setUserLocation] = useState(ROMA_COORDINATES);
  const [nearbyDrivers, setNearbyDrivers] = useState([]);
  const [trackingId, setTrackingId] = useState("");
  const [trackedDelivery, setTrackedDelivery] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  const [recentRequests, setRecentRequests] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => setUserLocation(ROMA_COORDINATES)
      );
    }
    // Mock nearby drivers
    setNearbyDrivers([
      { id: 1, name: "Thabo", lat: -29.4430, lng: 27.7150, distance: "0.5km", eta: "3 mins", vehicle: "Car", rating: 4.8 },
      { id: 2, name: "Mpho", lat: -29.4470, lng: 27.7190, distance: "0.8km", eta: "5 mins", vehicle: "Van", rating: 4.9 },
      { id: 3, name: "Lerato", lat: -29.4400, lng: 27.7120, distance: "1.2km", eta: "7 mins", vehicle: "Motorcycle", rating: 4.7 }
    ]);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("recentDeliveries");
    if (saved) setRecentRequests(JSON.parse(saved));
  }, []);

  const saveToRecent = (request) => {
    const updated = [request, ...recentRequests.slice(0, 4)];
    setRecentRequests(updated);
    localStorage.setItem("recentDeliveries", JSON.stringify(updated));
  };

  const handleRequestDeliveryClick = () => {
    if (!isLoggedIn) {
      if (window.confirm('You need to be logged in to request a delivery.\n\nWould you like to log in or create an account?'))
        navigate('/login', { state: { from: '/delivery', action: 'request' } });
      return;
    }
    setActiveForm("student");
    setShowModal(true);
  };

  const handleBecomeDriverClick = () => {
    if (!isLoggedIn) {
      if (window.confirm('You need to be logged in to register as a driver.\n\nWould you like to log in or create an account?'))
        navigate('/login', { state: { from: '/delivery', action: 'driver' } });
      return;
    }
    setActiveForm("provider");
    setShowModal(true);
  };

  const handleStudentSubmit = async (formData) => {
    if (!isLoggedIn) {
      alert('Please log in to submit a delivery request.');
      navigate('/login');
      return;
    }
    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/delivery/requests`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        const data = await res.json();
        saveToRecent({ id: data.id, ...formData, status: "pending", createdAt: new Date().toISOString() });
        alert(`✅ Request submitted!\n\nTracking ID: ${data.id}`);
        setShowModal(false);
      } else if (res.status === 401) {
        alert('Session expired. Please log in again.');
        navigate('/login');
      } else {
        const err = await res.json();
        alert(`❌ Failed: ${err.detail || 'Please try again.'}`);
      }
    } catch (error) {
      alert("❌ Cannot reach backend. Check your internet.");
    }
  };

  const handleDriverSubmit = async (formData) => {
    if (!isLoggedIn) {
      alert('Please log in to register as a driver.');
      navigate('/login');
      return;
    }
    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/delivery/drivers/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        const data = await res.json();
        alert(`✅ Registration successful!\n\nProvider ID: ${data.user_id}`);
        setShowModal(false);
      } else if (res.status === 401) {
        alert('Session expired. Please log in again.');
        navigate('/login');
      } else {
        const err = await res.json();
        alert(`❌ Failed: ${err.detail || 'Please try again.'}`);
      }
    } catch (error) {
      alert("❌ Cannot reach backend. Check your internet.");
    }
  };

  const handleTrackDelivery = (e) => {
    e.preventDefault();
    if (!trackingId.trim()) {
      alert("Please enter a tracking ID");
      return;
    }
    setIsTracking(true);
    setTimeout(() => {
      const mock = {
        id: trackingId,
        status: "in_transit",
        currentLocation: { lat: -29.4430, lng: 27.7150, address: "Roma Taxi Rank" },
        estimatedDelivery: "2026-03-26",
        driverName: "Thabo Malefetsane",
        driverPhone: "+266 5888 1234",
        timeline: [
          { date: "2026-03-24 14:30", status: "Pickup scheduled", location: "NUL Campus" },
          { date: "2026-03-24 16:45", status: "Package picked up", location: "NUL Campus" },
          { date: "2026-03-25 09:00", status: "In transit", location: "Roma Taxi Rank" }
        ]
      };
      setTrackedDelivery(mock);
      setIsTracking(false);
    }, 1500);
  };

  const getStatusIcon = (s) => ({ pending: '⏳', processing: '🔄', in_transit: '🚚', delivered: '✅' }[s] || '📦');
  const getStatusText = (s) => ({ pending: 'Pending', processing: 'Processing', in_transit: 'In Transit', delivered: 'Delivered' }[s] || s);

  return (
    <div className="delivery-page">
      <div className="delivery-container">
        <div className="delivery-hero">
          <div className="hero-icon">🚚</div>
          <h1 className="delivery-title">Fast & Reliable <span className="highlight">Student Delivery</span></h1>
          <p className="delivery-subtitle">The academic concierge service designed for the modern campus lifestyle.</p>
          <div className="hero-buttons">
            <button className="btn-primary" onClick={handleRequestDeliveryClick}>Request Delivery</button>
            <button className="btn-secondary" onClick={handleBecomeDriverClick}>Become a Driver</button>
          </div>
          <div className="hero-stats">
            <div className="stat-card"><span className="stat-value">200+</span><span className="stat-label">Active Drivers</span></div>
            <div className="stat-card"><span className="stat-value">&lt;20min</span><span className="stat-label">Avg. Delivery</span></div>
            <div className="stat-card"><span className="stat-value">4.9★</span><span className="stat-label">Rating</span></div>
          </div>
        </div>

        <div className="live-map-section">
          <h2>📍 Live Map - Nearby Drivers</h2>
          <p>See available drivers in your area</p>
          <div className="live-map">
            <MapContainer center={[userLocation.lat, userLocation.lng]} zoom={14} style={{ height: '400px', width: '100%', borderRadius: '16px' }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap' />
              <MapUpdater center={[userLocation.lat, userLocation.lng]} />
              <Marker position={[userLocation.lat, userLocation.lng]} icon={studentIcon}><Popup>📍 Your location<br/>Roma, Lesotho</Popup></Marker>
              {nearbyDrivers.map(driver => (
                <Marker key={driver.id} position={[driver.lat, driver.lng]} icon={driverIcon}>
                  <Popup><strong>{driver.name}</strong><br/>🚗 {driver.vehicle}<br/>📍 {driver.distance} away<br/>⏱️ ETA: {driver.eta}<br/>⭐ {driver.rating}/5</Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
          <p className="map-note">✨ {nearbyDrivers.length} drivers available nearby in Roma<br/>🏫 <strong>National University of Lesotho (NUL) area</strong></p>
        </div>

        <div className="delivery-features">
          <div className="delivery-card"><div className="feature-icon">⚡</div><h3>Fast Delivery</h3><p>Door-to-door in under 20 minutes</p></div>
          <div className="delivery-card"><div className="feature-icon">📍</div><h3>Real-time Location</h3><p>Watch your delivery move live</p></div>
          <div className="delivery-card"><div className="feature-icon">🛡️</div><h3>Safe & Trusted</h3><p>All couriers are verified students</p></div>
          <div className="delivery-card"><div className="feature-icon">💰</div><h3>Affordable</h3><p>Student-friendly rates</p></div>
        </div>

        <div className="tracking-section">
          <h2>Track Your Delivery</h2>
          <p>Enter your tracking ID to see real-time status</p>
          <form className="tracking-form" onSubmit={handleTrackDelivery}>
            <input type="text" placeholder="Tracking ID (e.g., DEL123456)" value={trackingId} onChange={(e) => setTrackingId(e.target.value)} />
            <button type="submit" disabled={isTracking}>{isTracking ? "Tracking..." : "Track Package"}</button>
          </form>
          {trackedDelivery && (
            <div className="tracking-result">
              <div className="tracking-status">
                <div className="status-header"><span className="status-icon">{getStatusIcon(trackedDelivery.status)}</span><span className={`status-badge ${trackedDelivery.status}`}>{getStatusText(trackedDelivery.status)}</span></div>
                <div className="tracking-map"><MapContainer center={[trackedDelivery.currentLocation.lat, trackedDelivery.currentLocation.lng]} zoom={15} style={{ height: '200px', width: '100%', borderRadius: '8px' }}><TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" /><Marker position={[trackedDelivery.currentLocation.lat, trackedDelivery.currentLocation.lng]}><Popup>Package here</Popup></Marker></MapContainer></div>
                <div className="status-details">
                  <p><strong>Tracking ID:</strong> {trackedDelivery.id}</p><p><strong>Current Location:</strong> {trackedDelivery.currentLocation.address}</p>
                  <p><strong>Estimated Delivery:</strong> {trackedDelivery.estimatedDelivery}</p><p><strong>Driver:</strong> {trackedDelivery.driverName}</p><p><strong>Driver Contact:</strong> {trackedDelivery.driverPhone}</p>
                </div>
                <div className="tracking-timeline"><h4>Delivery Timeline</h4>{trackedDelivery.timeline.map((event, idx) => (<div key={idx} className="timeline-item"><div className="timeline-dot"></div><div className="timeline-content"><div className="timeline-date">{event.date}</div><div className="timeline-status">{event.status}</div><div className="timeline-location">{event.location}</div></div></div>))}</div>
              </div>
            </div>
          )}
        </div>

        {recentRequests.length > 0 && (
          <div className="recent-requests"><h2>Recent Delivery Requests</h2><div className="requests-list">{recentRequests.map((req, idx) => (<div key={idx} className="request-item"><div className="request-icon">📦</div><div className="request-details"><p><strong>From:</strong> {req.pickup_location}</p><p><strong>To:</strong> {req.dropoff_location}</p><p><strong>Item:</strong> {req.item_description?.substring(0, 50)}...</p><small>Status: {req.status || 'Pending'}</small></div></div>))}</div></div>
        )}

        <div className="become-driver"><div className="driver-content"><div className="driver-icon">🚚</div><h2>Earn While You Study on Campus</h2><p>Join over 200 student couriers making money on their own schedule.</p><ul className="driver-benefits"><li>✓ Flexible hours around your classes</li><li>✓ Instant payouts after every delivery</li><li>✓ Exclusive campus gear & rewards</li></ul><button className="driver-btn" onClick={handleBecomeDriverClick}>Apply to Become Driver</button></div></div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setShowModal(false)}>✕</button>
            <div className="form-toggle">
              <button className={activeForm === "student" ? "active" : ""} onClick={() => setActiveForm("student")}>📦 Request Delivery</button>
              <button className={activeForm === "provider" ? "active" : ""} onClick={() => setActiveForm("provider")}>🚚 Become a Driver</button>
            </div>
            {activeForm === "student" && <StudentDeliveryForm onSubmit={handleStudentSubmit} onClose={() => setShowModal(false)} />}
            {activeForm === "provider" && <DriverRegistrationForm onSubmit={handleDriverSubmit} onClose={() => setShowModal(false)} />}
          </div>
        </div>
      )}
    </div>
  );
}

export default Delivery;