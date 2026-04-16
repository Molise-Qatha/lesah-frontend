const API_BASE = process.env.REACT_APP_API_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const deliveryService = {
  // Get nearby drivers
  async getNearbyDrivers(lat, lng, radius = 5) {
    const res = await fetch(
      `${API_BASE}/api/v1/delivery/drivers/nearby?lat=${lat}&lng=${lng}&radius=${radius}`
    );
    if (!res.ok) throw new Error('Failed to fetch drivers');
    return res.json();
  },

  // Create delivery request
  async createRequest(data) {
    const res = await fetch(`${API_BASE}/api/v1/delivery/requests`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || 'Request failed');
    }
    return res.json();
  },

  // Register as driver
  async registerDriver(data) {
    const res = await fetch(`${API_BASE}/api/v1/delivery/drivers/register`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || 'Registration failed');
    }
    return res.json();
  },

  // Track delivery by ID
  async getTrackingStatus(trackingId) {
    const res = await fetch(`${API_BASE}/api/v1/delivery/requests/${trackingId}/status`);
    if (!res.ok) throw new Error('Tracking ID not found');
    return res.json();
  },
};