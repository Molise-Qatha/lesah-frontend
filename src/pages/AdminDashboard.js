import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

function AdminDashboard() {
  const [stats, setStats] = useState({
    pending_loans: 0,
    pending_drivers: 0,
    pending_listings: 0,
    pending_deliveries: 0,
  });
  const [loans, setLoans] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [listings, setListings] = useState([]);
  const [deliveries, setDeliveries] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('loans');
  const navigate = useNavigate();

  const token = localStorage.getItem('access_token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchAll();
    setLoading(false);
  }, [navigate]);

  const fetchAll = () => {
    fetchStats();
    fetchLoans();
    fetchDrivers();
    fetchListings();
    fetchDeliveries();
    fetchUsers();
  };

  const fetchStats = async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/v1/admin/dashboard/stats`,
        { headers }
      );
      if (res.ok) setStats(await res.json());
    } catch (err) {
      console.error('Stats fetch error:', err);
    }
  };

  const fetchLoans = async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/v1/admin/loans/pending`,
        { headers }
      );
      if (res.ok) setLoans(await res.json());
    } catch (err) {
      console.error('Loans fetch error:', err);
    }
  };

  const fetchDrivers = async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/v1/admin/drivers/pending`,
        { headers }
      );
      if (res.ok) setDrivers(await res.json());
    } catch (err) {
      console.error('Drivers fetch error:', err);
    }
  };

  const fetchListings = async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/v1/admin/listings/pending`,
        { headers }
      );
      if (res.ok) setListings(await res.json());
    } catch (err) {
      console.error('Listings fetch error:', err);
    }
  };

  const fetchDeliveries = async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/v1/admin/deliveries/pending`,
        { headers }
      );
      if (res.ok) setDeliveries(await res.json());
    } catch (err) {
      console.error('Deliveries fetch error:', err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/v1/admin/users`,
        { headers }
      );
      if (res.ok) setUsers(await res.json());
    } catch (err) {
      console.error('Users fetch error:', err);
    }
  };

  // Helper: call a PATCH endpoint with automatic retry
  const patchWithRetry = async (url, options = {}) => {
    try {
      const res = await fetch(url, { method: 'PATCH', headers, ...options });
      if (res.ok) return res;
      // If first attempt fails due to server error, try once more
      console.warn('First attempt failed, retrying…');
      const retryRes = await fetch(url, { method: 'PATCH', headers, ...options });
      return retryRes;
    } catch (err) {
      // Network error – try again immediately
      console.warn('Network error, retrying…');
      const retryRes = await fetch(url, { method: 'PATCH', headers, ...options });
      return retryRes;
    }
  };

  const handleLoanStatus = async (loanId, status) => {
    const res = await patchWithRetry(
      `${process.env.REACT_APP_API_URL}/api/v1/admin/loans/${loanId}/status?status=${status}`
    );
    if (res && res.ok) {
      fetchLoans();
      fetchStats();
    } else {
      alert('Could not update loan. The backend may be asleep – please wait 10 seconds and try again.');
    }
  };

  const handleVerifyDriver = async (driverId, approve) => {
    const res = await patchWithRetry(
      `${process.env.REACT_APP_API_URL}/api/v1/admin/drivers/${driverId}/verify?approve=${approve}`
    );
    if (res && res.ok) {
      fetchDrivers();
      fetchStats();
    } else {
      alert('Could not verify driver. The backend may be asleep – please wait 10 seconds and try again.');
    }
  };

  const handleListingStatus = async (listingId, status) => {
    const res = await patchWithRetry(
      `${process.env.REACT_APP_API_URL}/api/v1/admin/listings/${listingId}/status?status=${status}`
    );
    if (res && res.ok) {
      fetchListings();
      fetchStats();
    } else {
      alert('Could not update listing. The backend may be asleep – please wait 10 seconds and try again.');
    }
  };

  const handleDeliveryStatus = async (deliveryId, status) => {
    const res = await patchWithRetry(
      `${process.env.REACT_APP_API_URL}/api/v1/admin/deliveries/${deliveryId}/status?status=${status}`
    );
    if (res && res.ok) {
      console.log(`Delivery ${deliveryId} marked as ${status}`);
      fetchDeliveries();
      fetchStats();
    } else {
      alert(`Failed to ${status} delivery. The backend may be asleep – wait 10 seconds and try again.`);
    }
  };

  if (loading) return <div className="admin-loading">Loading...</div>;

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>

      <div className="stats-cards">
        <div className="stat-card">
          <span className="stat-value">{stats.pending_loans}</span>
          <span className="stat-label">Pending Loans</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{stats.pending_drivers}</span>
          <span className="stat-label">Pending Drivers</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{stats.pending_listings}</span>
          <span className="stat-label">Pending Listings</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{stats.pending_deliveries}</span>
          <span className="stat-label">Pending Deliveries</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{users.length}</span>
          <span className="stat-label">Total Users</span>
        </div>
      </div>

      <div className="admin-tabs">
        <button className={`tab ${activeTab === 'loans' ? 'active' : ''}`} onClick={() => setActiveTab('loans')}>Loans</button>
        <button className={`tab ${activeTab === 'drivers' ? 'active' : ''}`} onClick={() => setActiveTab('drivers')}>Drivers</button>
        <button className={`tab ${activeTab === 'listings' ? 'active' : ''}`} onClick={() => setActiveTab('listings')}>Listings</button>
        <button className={`tab ${activeTab === 'deliveries' ? 'active' : ''}`} onClick={() => setActiveTab('deliveries')}>Deliveries</button>
        <button className={`tab ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>Users</button>
      </div>

      {/* Loans Tab */}
      {activeTab === 'loans' && (
        <section className="admin-section">
          <h2>Loan Applications</h2>
          {loans.length === 0 ? <p>No pending loans.</p> : (
            <div className="table-responsive">
              <table>
                <thead><tr><th>ID</th><th>User ID</th><th>Amount</th><th>Purpose</th><th>Created</th><th>Actions</th></tr></thead>
                <tbody>
                  {loans.map(loan => (
                    <tr key={loan.id}>
                      <td>{loan.id}</td><td>{loan.user_id}</td><td>M{loan.amount}</td><td>{loan.purpose}</td>
                      <td>{loan.created_at?.slice(0,10)}</td>
                      <td>
                        <button className="approve-btn" onClick={() => handleLoanStatus(loan.id, 'approved')}>Approve</button>
                        <button className="reject-btn" onClick={() => handleLoanStatus(loan.id, 'rejected')}>Reject</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {/* Drivers Tab */}
      {activeTab === 'drivers' && (
        <section className="admin-section">
          <h2>Driver Verification</h2>
          {drivers.length === 0 ? <p>No pending drivers.</p> : (
            <div className="table-responsive">
              <table>
                <thead><tr><th>ID</th><th>Full Name</th><th>Email</th><th>Vehicle</th><th>Area</th><th>Exp.</th><th>Actions</th></tr></thead>
                <tbody>
                  {drivers.map(driver => (
                    <tr key={driver.id}>
                      <td>{driver.id}</td><td>{driver.full_name}</td><td>{driver.email}</td>
                      <td>{driver.vehicle_type || 'N/A'}</td><td>{driver.area_covered || 'N/A'}</td>
                      <td>{driver.experience_years || '0'} yrs</td>
                      <td>
                        <button className="approve-btn" onClick={() => handleVerifyDriver(driver.id, true)}>Approve</button>
                        <button className="reject-btn" onClick={() => handleVerifyDriver(driver.id, false)}>Reject</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {/* Listings Tab */}
      {activeTab === 'listings' && (
        <section className="admin-section">
          <h2>Accommodation Listings</h2>
          {listings.length === 0 ? <p>No pending listings.</p> : (
            <div className="table-responsive">
              <table>
                <thead><tr><th>ID</th><th>Name</th><th>Location</th><th>Price</th><th>Type</th><th>Actions</th></tr></thead>
                <tbody>
                  {listings.map(listing => (
                    <tr key={listing.id}>
                      <td>{listing.id}</td><td>{listing.name}</td><td>{listing.location}</td>
                      <td>M{listing.price_value}</td><td>{listing.room_type}</td>
                      <td>
                        <button className="approve-btn" onClick={() => handleListingStatus(listing.id, 'approved')}>Approve</button>
                        <button className="reject-btn" onClick={() => handleListingStatus(listing.id, 'rejected')}>Reject</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {/* Deliveries Tab */}
      {activeTab === 'deliveries' && (
        <section className="admin-section">
          <h2>Delivery Requests</h2>
          {deliveries.length === 0 ? <p>No pending deliveries.</p> : (
            <div className="table-responsive">
              <table>
                <thead>
                  <tr>
                    <th>ID</th><th>User ID</th><th>Pickup</th><th>Dropoff</th>
                    <th>Item</th><th>Weight</th><th>Date</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {deliveries.map(delivery => (
                    <tr key={delivery.id}>
                      <td>{delivery.id}</td>
                      <td>{delivery.user_id}</td>
                      <td>{delivery.pickup_location || 'N/A'}</td>
                      <td>{delivery.dropoff_location || 'N/A'}</td>
                      <td>{delivery.item_description || 'N/A'}</td>
                      <td>{delivery.item_weight || 'N/A'}</td>
                      <td>{delivery.created_at?.slice(0,10)}</td>
                      <td>
                        <button className="approve-btn" onClick={() => handleDeliveryStatus(delivery.id, 'confirmed')}>Confirm</button>
                        <button className="reject-btn" onClick={() => handleDeliveryStatus(delivery.id, 'cancelled')}>Cancel</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <section className="admin-section">
          <h2>Registered Users</h2>
          {users.length === 0 ? <p>No users found.</p> : (
            <div className="table-responsive">
              <table>
                <thead><tr><th>ID</th><th>Full Name</th><th>Email</th><th>Role</th><th>Verified</th><th>Joined</th></tr></thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id}>
                      <td>{user.id}</td><td>{user.full_name}</td><td>{user.email}</td>
                      <td>{user.role}</td><td>{user.is_verified ? 'Yes' : 'No'}</td>
                      <td>{user.created_at?.slice(0,10)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}
    </div>
  );
}

export default AdminDashboard;
