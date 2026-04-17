import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

function AdminDashboard() {
  const [stats, setStats] = useState({ pending_loans: 0, pending_drivers: 0, pending_listings: 0 });
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        navigate('/login');
        return;
      }
      try {
        const [statsRes, loansRes] = await Promise.all([
          fetch(`${process.env.REACT_APP_API_URL}/api/v1/admin/dashboard/stats`, {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch(`${process.env.REACT_APP_API_URL}/api/v1/admin/loans/pending`, {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);
        if (statsRes.ok) setStats(await statsRes.json());
        if (loansRes.ok) setLoans(await loansRes.json());
      } catch (error) {
        console.error('Failed to load admin data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  const handleStatusUpdate = async (loanId, newStatus) => {
    const token = localStorage.getItem('access_token');
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/v1/admin/loans/${loanId}/status?status=${newStatus}`,
        { method: 'PATCH', headers: { 'Authorization': `Bearer ${token}` } }
      );
      if (res.ok) {
        setLoans(loans.filter(l => l.id !== loanId));
        setStats(prev => ({ ...prev, pending_loans: prev.pending_loans - 1 }));
      }
    } catch (error) {
      alert('Failed to update status');
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
      </div>

      <section className="pending-loans">
        <h2>Loan Applications</h2>
        {loans.length === 0 ? (
          <p>No pending loans.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>User</th>
                <th>Amount</th>
                <th>Purpose</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loans.map(loan => (
                <tr key={loan.id}>
                  <td>{loan.id}</td>
                  <td>{loan.user_id}</td>
                  <td>M{loan.amount}</td>
                  <td>{loan.purpose}</td>
                  <td>
                    <button className="approve-btn" onClick={() => handleStatusUpdate(loan.id, 'approved')}>Approve</button>
                    <button className="reject-btn" onClick={() => handleStatusUpdate(loan.id, 'rejected')}>Reject</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}

export default AdminDashboard;
