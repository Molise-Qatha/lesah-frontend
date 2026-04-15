import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

function Dashboard() {
  // Simulated user data - we'll just hardcode this for now
  const user = {
    name: 'John Doe',
    email: 'student@university.ac.za',
    studentId: 'STU12345',
    university: 'University of Technology'
  };

  const [activeDelivery, setActiveDelivery] = useState({
    id: 'DEL123456',
    status: 'in_transit',
    location: 'City Center Hub',
    estimatedDelivery: '2026-03-26',
    items: 'Textbooks, Laptop'
  });

  const [activeLoan, setActiveLoan] = useState({
    id: 'LN789012',
    amount: 'R15,000',
    remaining: 'R8,500',
    nextPayment: '2026-04-15',
    status: 'active'
  });

  const [accommodation, setAccommodation] = useState({
    name: 'Sunrise Residence',
    room: 'Room 304',
    leaseEnd: '2026-12-31',
    status: 'active'
  });

  const deliveryStatus = {
    pending: '⏳ Pending',
    processing: '🔄 Processing',
    in_transit: '🚚 In Transit',
    delivered: '✅ Delivered'
  };

  return (
    <div className="dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1>Welcome back, {user.name}!</h1>
          <p>Here's what's happening with your LeSAH services</p>
          <div className="user-info-badge">
            <span className="badge">🎓 {user.studentId}</span>
            <span className="badge">🏛️ {user.university}</span>
          </div>
        </div>

        <div className="dashboard-grid">
          {/* Delivery Tracking Card */}
          <div className="dashboard-card">
            <div className="card-header">
              <h2>🚚 Active Delivery</h2>
              <Link to="/delivery-tracking" className="view-link">View Details →</Link>
            </div>
            {activeDelivery ? (
              <div className="card-content">
                <div className="delivery-info">
                  <p><strong>Tracking ID:</strong> {activeDelivery.id}</p>
                  <p><strong>Status:</strong> <span className={`status ${activeDelivery.status}`}>{deliveryStatus[activeDelivery.status]}</span></p>
                  <p><strong>Current Location:</strong> {activeDelivery.location}</p>
                  <p><strong>Estimated Delivery:</strong> {activeDelivery.estimatedDelivery}</p>
                  <div className="progress-bar">
                    <div className={`progress ${activeDelivery.status}`}></div>
                  </div>
                </div>
              </div>
            ) : (
              <p>No active deliveries. <Link to="/delivery">Start a delivery →</Link></p>
            )}
          </div>

          {/* Loan Status Card */}
          <div className="dashboard-card">
            <div className="card-header">
              <h2>💰 Student Loan</h2>
              <Link to="/my-loans" className="view-link">View Details →</Link>
            </div>
            {activeLoan ? (
              <div className="card-content">
                <div className="loan-info">
                  <p><strong>Loan ID:</strong> {activeLoan.id}</p>
                  <p><strong>Total Amount:</strong> {activeLoan.amount}</p>
                  <p><strong>Remaining Balance:</strong> {activeLoan.remaining}</p>
                  <p><strong>Next Payment:</strong> {activeLoan.nextPayment}</p>
                  <div className="loan-progress">
                    <div className="loan-progress-bar" style={{ width: '43%' }}></div>
                    <span>57% Paid</span>
                  </div>
                </div>
              </div>
            ) : (
              <p>No active loans. <Link to="/loans">Apply for a loan →</Link></p>
            )}
          </div>

          {/* Accommodation Card */}
          <div className="dashboard-card">
            <div className="card-header">
              <h2>🏠 Accommodation</h2>
              <Link to="/my-accommodation" className="view-link">View Details →</Link>
            </div>
            {accommodation ? (
              <div className="card-content">
                <p><strong>Residence:</strong> {accommodation.name}</p>
                <p><strong>Room:</strong> {accommodation.room}</p>
                <p><strong>Lease Ends:</strong> {accommodation.leaseEnd}</p>
                <p><strong>Status:</strong> <span className="status active">✓ Active</span></p>
              </div>
            ) : (
              <p>No accommodation booked. <Link to="/accommodation">Find accommodation →</Link></p>
            )}
          </div>

          {/* Quick Actions */}
          <div className="dashboard-card quick-actions">
            <h2>Quick Actions</h2>
            <div className="actions-grid">
              <Link to="/delivery/new" className="action-btn">
                <span>📦</span>
                New Delivery
              </Link>
              <Link to="/loans/apply" className="action-btn">
                <span>💰</span>
                Apply for Loan
              </Link>
              <Link to="/accommodation/search" className="action-btn">
                <span>🔍</span>
                Find Room
              </Link>
              <Link to="/profile" className="action-btn">
                <span>⚙️</span>
                Settings
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="recent-activity">
          <h2>Recent Activity</h2>
          <div className="activity-list">
            <div className="activity-item">
              <span className="activity-icon">📦</span>
              <div className="activity-details">
                <p><strong>Delivery Update:</strong> Your package is in transit</p>
                <small>2 hours ago</small>
              </div>
            </div>
            <div className="activity-item">
              <span className="activity-icon">💰</span>
              <div className="activity-details">
                <p><strong>Payment Received:</strong> Monthly loan payment of R1,500</p>
                <small>3 days ago</small>
              </div>
            </div>
            <div className="activity-item">
              <span className="activity-icon">🏠</span>
              <div className="activity-details">
                <p><strong>Accommodation:</strong> Lease renewed for 2026</p>
                <small>1 week ago</small>
              </div>
            </div>
            <div className="activity-item">
              <span className="activity-icon">🎓</span>
              <div className="activity-details">
                <p><strong>Study Resources:</strong> New academic materials available</p>
                <small>2 weeks ago</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;