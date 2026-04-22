import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast, Toaster } from 'react-hot-toast';
import './Accommodation.css';
import accommodationHeroBg from '../assets/images/accommodation-hero-bg.jpg';
import { accommodationService } from '../services/accommodationService';

// Booking form validation schema
const bookingSchema = z.object({
  full_name: z.string().min(2, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(8, 'Valid phone number required'),
  student_id: z.string().min(1, 'Student ID is required'),
  institution: z.string().min(1, 'Please select an institution'),
  move_in_date: z.string().min(1, 'Move-in date is required'),
  duration: z.string().min(1, 'Duration is required'),
  preferred_visit: z.string().optional(),
  terms: z.literal(true, {
    errorMap: () => ({ message: 'You must accept the terms' }),
  }),
  deposit: z.literal(true, {
    errorMap: () => ({ message: 'You must acknowledge the deposit' }),
  }),
});

// Mock listing for Makhutlang Phama Residence
const mockListings = [
  {
    id: 1,
    name: 'Makhutlang Phama Residence',
    location: 'Maseru',
    area: 'Roma',
    price_value: 500,
    room_type: 'private',
    distance: 'Walking distance to NUL',
    amenities: ['24/7 Security', 'Private Room', 'Freedom'],
    available: true,
    rating: 4.5,
    description: 'Private one‑room residence. Enjoy your freedom with security. Walking distance to the National University of Lesotho.',
  },
];

function Accommodation() {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [bookingSubmitted, setBookingSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [myBookings, setMyBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('listings');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoadingListings, setIsLoadingListings] = useState(true);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);
  const [fetchError, setFetchError] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      preferred_visit: '',
    },
  });

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    setIsLoggedIn(!!token);
  }, []);

  // Fetch listings from backend (fallback to mock)
  useEffect(() => {
    const fetchListings = async () => {
      setIsLoadingListings(true);
      setFetchError('');
      try {
        const data = await accommodationService.getListings();
        if (data && data.length > 0) {
          setListings(data);
          setFilteredListings(data);
        } else {
          // Use mock listing
          setListings(mockListings);
          setFilteredListings(mockListings);
        }
      } catch (error) {
        console.error('Failed to fetch listings, using mock:', error);
        setListings(mockListings);
        setFilteredListings(mockListings);
      } finally {
        setIsLoadingListings(false);
      }
    };
    fetchListings();
  }, []);

  // Apply filters client‑side
  useEffect(() => {
    let filtered = [...listings];
    if (selectedLocation !== 'all') {
      filtered = filtered.filter(l => l.location === selectedLocation);
    }
    if (priceRange === 'low') {
      filtered = filtered.filter(l => l.price_value < 700);
    } else if (priceRange === 'medium') {
      filtered = filtered.filter(l => l.price_value >= 700 && l.price_value <= 850);
    } else if (priceRange === 'high') {
      filtered = filtered.filter(l => l.price_value > 850);
    }
    if (selectedType !== 'all') {
      filtered = filtered.filter(l => l.room_type === selectedType);
    }
    setFilteredListings(filtered);
  }, [listings, selectedLocation, priceRange, selectedType]);

  // Fetch user bookings when on bookings tab
  useEffect(() => {
    if (isLoggedIn && activeTab === 'bookings') {
      fetchMyBookings();
    }
  }, [isLoggedIn, activeTab]);

  // Handle pending booking after login
  useEffect(() => {
    const pendingBooking = sessionStorage.getItem('pendingBooking');
    if (pendingBooking && isLoggedIn) {
      sessionStorage.removeItem('pendingBooking');
      const property = JSON.parse(pendingBooking);
      setSelectedProperty(property);
      setShowBookingModal(true);
    }
  }, [isLoggedIn]);

  const fetchMyBookings = async () => {
    setIsLoadingBookings(true);
    try {
      const data = await accommodationService.getMyBookings();
      setMyBookings(data);
    } catch (error) {
      toast.error('Failed to load your bookings');
    } finally {
      setIsLoadingBookings(false);
    }
  };

  const locations = ['all', ...new Set(listings.map(l => l.location))];

  const handleBookNow = (property) => {
    if (!isLoggedIn) {
      toast.error('Please log in to book accommodation');
      sessionStorage.setItem('pendingBooking', JSON.stringify(property));
      navigate('/login', { state: { from: '/accommodation', action: 'book', propertyId: property.id } });
      return;
    }
    setSelectedProperty(property);
    reset();
    setShowBookingModal(true);
  };

  const onBookingSubmit = async (formData) => {
    if (!isLoggedIn) {
      toast.error('Session expired. Please log in again.');
      navigate('/login');
      return;
    }
    setIsSubmitting(true);
    try {
      const payload = {
        accommodation_id: selectedProperty.id,
        ...formData,
      };
      await accommodationService.createBooking(payload);
      setBookingSubmitted(true);
      toast.success('Booking request submitted!');
      if (activeTab === 'bookings') {
        fetchMyBookings();
      }
      setTimeout(() => {
        setShowBookingModal(false);
        setBookingSubmitted(false);
        setSelectedProperty(null);
      }, 3000);
    } catch (error) {
      toast.error(error.message || 'Booking failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="accommodation-page">
      <Toaster position="top-center" toastOptions={{ duration: 4000 }} />
      <div className="accommodation-container">
        {/* Hero Section */}
        <div
          className="accommodation-hero"
          style={{
            backgroundImage: `linear-gradient(135deg, rgba(42, 157, 143, 0.85), rgba(38, 70, 83, 0.85)), url(${accommodationHeroBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="hero-icon">🏠</div>
          <h1>Find Your Perfect Student Home</h1>
          <p>Discover safe, comfortable, and affordable accommodation near your campus</p>
        </div>

        {/* Tabs */}
        <div className="accommodation-tabs">
          <button
            className={`tab ${activeTab === 'listings' ? 'active' : ''}`}
            onClick={() => setActiveTab('listings')}
          >
            🔍 Find Accommodation
          </button>
          <button
            className={`tab ${activeTab === 'bookings' ? 'active' : ''}`}
            onClick={() => setActiveTab('bookings')}
          >
            📋 My Bookings {myBookings.length > 0 && `(${myBookings.length})`}
          </button>
        </div>

        {/* Listings Tab */}
        {activeTab === 'listings' && (
          <>
            <div className="filters-section">
              <div className="filter-group">
                <label>📍 Location</label>
                <select value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)}>
                  <option value="all">All Locations</option>
                  {locations.filter(l => l !== 'all').map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>
              <div className="filter-group">
                <label>💰 Price Range</label>
                <select value={priceRange} onChange={(e) => setPriceRange(e.target.value)}>
                  <option value="all">All Prices</option>
                  <option value="low">Under M700</option>
                  <option value="medium">M700 – M850</option>
                  <option value="high">Above M850</option>
                </select>
              </div>
              <div className="filter-group">
                <label>🏘️ Room Type</label>
                <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
                  <option value="all">All Types</option>
                  <option value="shared">Shared Room</option>
                  <option value="private">Private Room</option>
                </select>
              </div>
            </div>

            <div className="results-count">
              Found <strong>{filteredListings.length}</strong> accommodation{filteredListings.length !== 1 ? 's' : ''}
            </div>

            {isLoadingListings ? (
              <div className="loading-grid">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="skeleton-card">
                    <div className="skeleton-image"></div>
                    <div className="skeleton-text"></div>
                    <div className="skeleton-text short"></div>
                    <div className="skeleton-text"></div>
                  </div>
                ))}
              </div>
            ) : fetchError ? (
              <div className="error-state">
                <div className="error-icon">⚠️</div>
                <h3>Something went wrong</h3>
                <p>{fetchError}</p>
                <button onClick={() => window.location.reload()} className="retry-btn">
                  Try Again
                </button>
              </div>
            ) : filteredListings.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🔍</div>
                <h3>No accommodations found</h3>
                <p>Try adjusting your filters to see more options</p>
                <button
                  onClick={() => {
                    setSelectedLocation('all');
                    setPriceRange('all');
                    setSelectedType('all');
                  }}
                  className="reset-btn"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="accommodation-grid">
                {filteredListings.map(acc => (
                  <div key={acc.id} className="accommodation-card">
                    <div className="card-image">
                      {acc.image_url ? (
                        <img src={acc.image_url} alt={acc.name} className="property-image" />
                      ) : (
                        <div className="image-placeholder">
                          <span className="placeholder-icon">🏠</span>
                          <span className="placeholder-text">Photo coming soon</span>
                        </div>
                      )}
                      {!acc.available && <span className="unavailable-badge">Fully Booked</span>}
                      <div className="rating-badge">
                        <span>⭐</span> {acc.rating?.toFixed(1) || '4.5'}
                      </div>
                    </div>
                    <div className="card-content">
                      <div className="card-header">
                        <h3>{acc.name}</h3>
                        <span className={`property-type ${acc.room_type}`}>
                          {acc.room_type === 'shared' ? 'Shared' : 'Private'}
                        </span>
                      </div>
                      <p className="location">
                        <span className="icon">📍</span> {acc.location} • {acc.area || acc.neighborhood}
                      </p>
                      <p className="distance">
                        <span className="icon">🚶</span> {acc.distance || 'Near campus'}
                      </p>
                      <p className="price">
                        M{acc.price_value}<span>/month</span>
                      </p>
                      <div className="amenities">
                        {(acc.amenities || []).slice(0, 3).map((item, idx) => (
                          <span key={idx} className="amenity-tag">{item}</span>
                        ))}
                        {(acc.amenities || []).length > 3 && (
                          <span className="amenity-tag more">+{acc.amenities.length - 3}</span>
                        )}
                      </div>
                      <p className="description">{acc.description?.substring(0, 80)}...</p>
                      <button
                        className={`book-btn ${!acc.available ? 'disabled' : ''}`}
                        onClick={() => handleBookNow(acc)}
                        disabled={!acc.available}
                      >
                        {acc.available ? 'Book Now →' : 'Currently Unavailable'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* How It Works */}
            <div className="info-section">
              <h3>📋 How It Works</h3>
              <div className="steps">
                <div className="step">
                  <div className="step-number">1</div>
                  <h4>Browse Listings</h4>
                  <p>Find accommodation that fits your needs and budget.</p>
                </div>
                <div className="step">
                  <div className="step-number">2</div>
                  <h4>Submit Booking</h4>
                  <p>Fill in your details and preferred move‑in date.</p>
                </div>
                <div className="step">
                  <div className="step-number">3</div>
                  <h4>Property Visit</h4>
                  <p>Schedule a visit to view the property in person.</p>
                </div>
                <div className="step">
                  <div className="step-number">4</div>
                  <h4>Sign & Move In</h4>
                  <p>Complete paperwork and settle into your new home.</p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* My Bookings Tab */}
        {activeTab === 'bookings' && (
          <div className="bookings-section">
            {!isLoggedIn ? (
              <div className="login-prompt">
                <div className="login-icon">🔐</div>
                <h3>Login Required</h3>
                <p>Please log in to view your bookings.</p>
                <button onClick={() => navigate('/login')} className="login-prompt-btn">
                  Login / Sign Up
                </button>
              </div>
            ) : isLoadingBookings ? (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Loading your bookings...</p>
              </div>
            ) : myBookings.length > 0 ? (
              <div className="bookings-list">
                {myBookings.map(booking => (
                  <div key={booking.id} className="booking-card">
                    <div className="booking-header">
                      <div className="booking-icon">🏠</div>
                      <div className="booking-info">
                        <h3>{booking.accommodation?.name || 'Accommodation'}</h3>
                        <p className="booking-id">Booking #{booking.id}</p>
                      </div>
                      <span className={`booking-status ${booking.status}`}>
                        {booking.status}
                      </span>
                    </div>
                    <div className="booking-details">
                      <div className="detail-row">
                        <span>Student</span>
                        <strong>{booking.full_name}</strong>
                      </div>
                      <div className="detail-row">
                        <span>Student ID</span>
                        <span>{booking.student_id}</span>
                      </div>
                      <div className="detail-row">
                        <span>Institution</span>
                        <span>{booking.institution}</span>
                      </div>
                      <div className="detail-row">
                        <span>Move‑in Date</span>
                        <span>{booking.move_in_date}</span>
                      </div>
                      <div className="detail-row">
                        <span>Duration</span>
                        <span>{booking.duration}</span>
                      </div>
                      <div className="detail-row">
                        <span>Booked on</span>
                        <span>{new Date(booking.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="booking-actions">
                      <button className="contact-btn">📞 Contact Landlord</button>
                      <button className="view-details-btn">👁️ View Details</button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">📋</div>
                <h3>No Bookings Yet</h3>
                <p>Browse available accommodations and make your first booking.</p>
                <button onClick={() => setActiveTab('listings')} className="browse-btn">
                  Browse Accommodations
                </button>
              </div>
            )}
          </div>
        )}

        {/* FAQ Section */}
        <div className="faq-section">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-grid">
            <div className="faq-item">
              <h3>How do I book accommodation?</h3>
              <p>Browse listings, click "Book Now" and fill out the form. We'll contact you to arrange a viewing.</p>
            </div>
            <div className="faq-item">
              <h3>Is there a deposit required?</h3>
              <p>Most properties require a refundable deposit equal to one month's rent.</p>
            </div>
            <div className="faq-item">
              <h3>Can I view the property before booking?</h3>
              <p>Yes! After submitting a booking request, we'll help arrange a property visit.</p>
            </div>
            <div className="faq-item">
              <h3>What documents do I need?</h3>
              <p>Student ID, proof of registration, and a valid ID/passport.</p>
            </div>
            <div className="faq-item">
              <h3>Are utilities included?</h3>
              <p>Varies by property. Check individual listings for details.</p>
            </div>
            <div className="faq-item">
              <h3>Can I cancel my booking?</h3>
              <p>Cancellation policies vary. Contact support for assistance.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && selectedProperty && (
        <div className="modal-overlay" onClick={() => setShowBookingModal(false)}>
          <div className="booking-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setShowBookingModal(false)}>✕</button>
            {!bookingSubmitted ? (
              <>
                <h2>Book {selectedProperty.name}</h2>
                <div className="booking-summary">
                  <p><strong>📍 Location:</strong> {selectedProperty.location}</p>
                  <p><strong>💰 Price:</strong> M{selectedProperty.price_value}/month</p>
                  <p><strong>🏘️ Type:</strong> {selectedProperty.room_type === 'shared' ? 'Shared Room' : 'Private Room'}</p>
                </div>
                <form onSubmit={handleSubmit(onBookingSubmit)} className="booking-form">
                  <div className="form-row">
                    <div className="input-group">
                      <input {...register('full_name')} placeholder="Full Name" />
                      {errors.full_name && <span className="error-text">{errors.full_name.message}</span>}
                    </div>
                    <div className="input-group">
                      <input {...register('email')} placeholder="Email Address" type="email" />
                      {errors.email && <span className="error-text">{errors.email.message}</span>}
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="input-group">
                      <input {...register('phone')} placeholder="Phone Number" />
                      {errors.phone && <span className="error-text">{errors.phone.message}</span>}
                    </div>
                    <div className="input-group">
                      <input {...register('student_id')} placeholder="Student ID" />
                      {errors.student_id && <span className="error-text">{errors.student_id.message}</span>}
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="input-group">
                      <select {...register('institution')}>
                        <option value="">Select Institution</option>
                        <option value="NUL">National University of Lesotho</option>
                        <option value="LEC">Lesotho Evangelical Church</option>
                        <option value="Limkokwing">Limkokwing University</option>
                        <option value="Botho">Botho University</option>
                        <option value="Other">Other Institution</option>
                      </select>
                      {errors.institution && <span className="error-text">{errors.institution.message}</span>}
                    </div>
                    <div className="input-group">
                      <input type="date" {...register('move_in_date')} />
                      {errors.move_in_date && <span className="error-text">{errors.move_in_date.message}</span>}
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="input-group">
                      <select {...register('duration')}>
                        <option value="">Preferred Duration</option>
                        <option value="1 month">1 month</option>
                        <option value="3 months">3 months</option>
                        <option value="6 months">6 months</option>
                        <option value="12 months">12 months</option>
                      </select>
                      {errors.duration && <span className="error-text">{errors.duration.message}</span>}
                    </div>
                    <div className="input-group">
                      <select {...register('preferred_visit')}>
                        <option value="">Preferred Visit Time (Optional)</option>
                        <option value="morning">Morning (9am – 12pm)</option>
                        <option value="afternoon">Afternoon (2pm – 5pm)</option>
                        <option value="evening">Evening (5pm – 7pm)</option>
                      </select>
                    </div>
                  </div>
                  <div className="checkbox-group">
                    <label className="checkbox-label">
                      <input type="checkbox" {...register('terms')} />
                      <span>I confirm that I have read and agree to the booking terms and conditions</span>
                    </label>
                    {errors.terms && <span className="error-text">{errors.terms.message}</span>}
                  </div>
                  <div className="checkbox-group">
                    <label className="checkbox-label">
                      <input type="checkbox" {...register('deposit')} />
                      <span>I understand that a refundable deposit may be required upon confirmation</span>
                    </label>
                    {errors.deposit && <span className="error-text">{errors.deposit.message}</span>}
                  </div>
                  <button type="submit" className="submit-booking-btn" disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit Booking Request'}
                  </button>
                </form>
              </>
            ) : (
              <div className="success-message">
                <div className="success-icon">✓</div>
                <h3>Booking Request Submitted!</h3>
                <p>Your request for <strong>{selectedProperty.name}</strong> has been received.</p>
                <p>We will contact you within 24 hours to arrange a property visit.</p>
                <div className="next-steps">
                  <h4>What's Next?</h4>
                  <ul>
                    <li>📧 Check your email for confirmation</li>
                    <li>📞 We'll call to schedule a viewing</li>
                    <li>🪪 Bring your student ID and documents to the viewing</li>
                    <li>✍️ Sign contract and pay deposit to move in</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Accommodation;
