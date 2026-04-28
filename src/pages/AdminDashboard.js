import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

function AdminDashboard() {
  const [stats, setStats] = useState({ pending_loans: 0, pending_drivers: 0, pending_listings: 0 });
  const [loans, setLoans] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [listings, setListings] = useState([]);
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
    fetchStats();
    fetchLoans();
    fetchDrivers();
    fetchListings();
    fetchUsers();
    setLoading(false);
  }, [navigate]);

  const fetchStats = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/admin/dashboard/stats`, { headers });
      if (res.ok) setStats(await res.json());
    } catch (err) { console.error(err); }
  };

  const fetchLoans = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/admin/loans/pending`, { headers });
      if (res.ok) setLoans(await res.json());
    } catch (err) { console.error(err); }
  };

  const fetchDrivers = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/admin/drivers/pending`, { headers });
      if (res.ok) setDrivers(await res.json());
    } catch (err) { console.error(err); }
  };

  const fetchListings = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/admin/listings/pending`, { headers });
      if (res.ok) setListings(await res.json());
    } catch (err) { console.error(err); }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/admin/users`, { headers });
      if (res.ok) setUsers(await res.json());
    } catch (err) { console.error(err); }
  };

  const handleLoanStatus = async (loanId, status) => {
    await fetch(`${process.env.REACT_APP_API_URL}/api/v1/admin/loans/${loanId}/status?status=${status}`, {
      method: 'PATCH', headers
    });
    fetchLoans();
    fetchStats();
  };

  const handleVerifyDriver = async (driverId, approve) => {
    await fetch(`${process.env.REACT_APP_API_URL}/api/v1/admin/drivers/${driverId}/verify?approve=${approve}`, {
      method: 'PATCH', headers
    });
    fetchDrivers();
    fetchStats();
  };

  const handleListingStatus = async (listingId, status) => {
    await fetch(`${process.env.REACT_APP_API_URL}/api/v1/admin/listings/${listingId}/status?status=${status}`, {
      method: 'PATCH', headers
    });
    fetchListings();
    fetchStats();
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
          <span className="stat-value">{users.length}</span>
          <span className="stat-label">Total Users</span>
        </div>
      </div>

      <div className="admin-tabs">
        <button className={`tab ${activeTab === 'loans' ? 'active' : ''}`} onClick={() => setActiveTab('loans')}>Loans</button>
        <button className={`tab ${activeTab === 'drivers' ? 'active' : ''}`} onClick={() => setActiveTab('drivers')}>Drivers</button>
        <button className={`tab ${activeTab === 'listings' ? 'active' : ''}`} onClick={() => setActiveTab('listings')}>Listings</button>
        <button className={`tab ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>Users</button>
      </div>

      {/* Loans Tab */}
      {activeTab === 'loans' && (
        <section className="admin-section">
          <h2>Loan Applications</h2>
          {loans.length === 0 ? <p>No pending loans.</p> : (
            <div className="table-responsive">
              <table>
                <thead>
                  <tr><th>ID</th><th>User ID</th><th>Amount</th><th>Purpose</th><th>Created</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {loans.map(loan => (
                    <tr key={loan.id}>
                      <td>{loan.id}</td>
                      <td>{loan.user_id}</td>
                      <td>M{loan.amount}</td>
                      <td>{loan.purpose}</td>
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
                <thead>
                  <tr><th>ID</th><th>Full Name</th><th>Vehicle</th><th>Area</th><th>Experience</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {drivers.map(driver => (
                    <tr key={driver.id}>
                      <td>{driver.id}</td>
                      <td>{driver.full_name}</td>
                      <td>{driver.vehicle_type}</td>
                      <td>{driver.area_covered}</td>
                      <td>{driver.experience_years} yrs</td>
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
                <thead>
                  <tr><th>ID</th><th>Name</th><th>Location</th><th>Price</th><th>Type</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {listings.map(listing => (
                    <tr key={listing.id}>
                      <td>{listing.id}</td>
                      <td>{listing.name}</td>
                      <td>{listing.location}</td>
                      <td>M{listing.price_value}</td>
                      <td>{listing.room_type}</td>
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

      {/* Users Tab */}
      {activeTab === 'users' && (
        <section className="admin-section">
          <h2>Registered Users</h2>
          {users.length === 0 ? <p>No users found.</p> : (
            <div className="table-responsive">
              <table>
                <thead>
                  <tr><th>ID</th><th>Full Name</th><th>Email</th><th>Role</th><th>Verified</th><th>Joined</th></tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.full_name}</td>
                      <td>{user.email}</td>
                      <td>{user.role}</td>
                      <td>{user.is_verified ? 'Yes' : 'No'}</td>
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
