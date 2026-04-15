import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './AccountMenu.css';

function AccountMenu({ onClose, onLogout }) {
  const menuRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div className="account-menu" ref={menuRef}>
      <div className="menu-header">
        <div className="menu-avatar">👤</div>
        <div className="menu-user-info">
          <h4>John Doe</h4>
          <p>Student ID: STU12345</p>
        </div>
      </div>
      
      <div className="menu-items">
        <Link to="/dashboard" className="menu-item" onClick={onClose}>
          <span className="menu-icon">📊</span>
          Dashboard
        </Link>
        <Link to="/delivery-tracking" className="menu-item" onClick={onClose}>
          <span className="menu-icon">🚚</span>
          Track Delivery
        </Link>
        <Link to="/my-loans" className="menu-item" onClick={onClose}>
          <span className="menu-icon">💰</span>
          My Loans
        </Link>
        <Link to="/my-accommodation" className="menu-item" onClick={onClose}>
          <span className="menu-icon">🏠</span>
          My Accommodation
        </Link>
        <Link to="/profile" className="menu-item" onClick={onClose}>
          <span className="menu-icon">⚙️</span>
          Profile Settings
        </Link>
        <button className="menu-item logout" onClick={onLogout}>
          <span className="menu-icon">🚪</span>
          Logout
        </button>
      </div>
    </div>
  );
}

export default AccountMenu;