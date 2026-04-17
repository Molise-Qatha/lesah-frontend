// src/services/deliveryService.js

const API_BASE = process.env.REACT_APP_API_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

/**
 * Generic API request handler with consistent error handling
 */
async function apiRequest(endpoint, options = {}) {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, options);
    
    // Try to parse JSON response
    let data;
    try {
      data = await res.json();
    } catch {
      data = null;
    }
    
    if (!res.ok) {
      // Use detail from response if available, otherwise status text
      const errorMessage = data?.detail || data?.message || `Request failed with status ${res.status}`;
      throw new Error(errorMessage);
    }
    
    return data;
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
}

export const deliveryService = {
  // Get nearby drivers
  async getNearbyDrivers(lat, lng, radius = 5) {
    return apiRequest(
      `/api/v1/delivery/drivers/nearby?lat=${lat}&lng=${lng}&radius=${radius}`
    );
  },

  // Create delivery request
  async createRequest(data) {
    return apiRequest('/api/v1/delivery/requests', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
  },

  // Register as driver
  async registerDriver(data) {
    return apiRequest('/api/v1/delivery/drivers/register', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
  },

  // Track delivery by ID
  async getTrackingStatus(trackingId) {
    return apiRequest(`/api/v1/delivery/requests/${trackingId}/status`);
  },
};

export default deliveryService;
