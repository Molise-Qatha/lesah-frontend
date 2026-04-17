// src/services/accommodationService.js

const API_BASE = process.env.REACT_APP_API_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

async function apiRequest(endpoint, options = {}) {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, options);
    let data;
    try {
      data = await res.json();
    } catch {
      data = null;
    }
    if (!res.ok) {
      const errorMessage = data?.detail || data?.message || `Request failed with status ${res.status}`;
      throw new Error(errorMessage);
    }
    return data;
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
}

export const accommodationService = {
  // Get all listings with optional filters
  async getListings(filters = {}) {
    const params = new URLSearchParams();
    if (filters.location) params.append('location', filters.location);
    if (filters.min_price) params.append('min_price', filters.min_price);
    if (filters.max_price) params.append('max_price', filters.max_price);
    if (filters.room_type) params.append('room_type', filters.room_type);
    const query = params.toString();
    return apiRequest(`/api/v1/accommodation/listings${query ? `?${query}` : ''}`);
  },

  // Get user's bookings
  async getMyBookings() {
    return apiRequest('/api/v1/accommodation/my-bookings', {
      headers: getAuthHeaders(),
    });
  },

  // Create a booking request
  async createBooking(data) {
    return apiRequest('/api/v1/accommodation/bookings', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
  },
};

export default accommodationService;
