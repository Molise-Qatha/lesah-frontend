// src/utils/formatters.js

/**
 * Format a phone number to E.164 international format for Lesotho (+266)
 * @param {string} phone - Raw phone number input
 * @returns {string} Formatted phone number
 */
export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  // If already has country code, ensure it's properly formatted
  if (cleaned.startsWith('266') && cleaned.length > 3) {
    return `+${cleaned}`;
  }
  // Assume 8-digit local number
  if (cleaned.length === 8) {
    return `+266${cleaned}`;
  }
  // Fallback: just add + if missing
  return phone.startsWith('+') ? phone : `+${phone}`;
};

/**
 * Format currency in Lesotho Loti (LSL)
 * @param {number} amount - Amount in maloti
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-LS', {
    style: 'currency',
    currency: 'LSL',
    minimumFractionDigits: 2,
  }).format(amount);
};

/**
 * Format a date string to a readable format
 * @param {string} dateStr - ISO date string
 * @returns {string} Formatted date
 */
export const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('en-LS', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Calculate estimated delivery time based on distance
 * @param {number} distanceKm - Distance in kilometers
 * @returns {string} ETA string
 */
export const calculateETA = (distanceKm) => {
  // Assume average speed 30 km/h in Roma
  const minutes = Math.ceil((distanceKm / 30) * 60);
  if (minutes < 5) return '5 mins';
  if (minutes < 60) return `${minutes} mins`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};