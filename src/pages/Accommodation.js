import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Accommodation.css';

// Import local background image
import accommodationHeroBg from '../assets/images/accommodation-hero-bg.jpg';

function Accommodation() {
  const navigate = useNavigate();
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [bookingSubmitted, setBookingSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [myBookings, setMyBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('listings');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    setIsLoggedIn(!!token);
  }, []);

  // Load user's bookings from backend when logged in and on bookings tab
  useEffect(() => {
    if (isLoggedIn && activeTab === 'bookings') {
      fetchMyBookings();
    }
  }, [isLoggedIn, activeTab]);

  // Check for pending booking after login
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
    const token = localStorage.getItem('access_token');
    if (!token) return;
    
    setIsLoading(true);
    try {
      // ✅ FIXED: include /api/v1
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/accommodation/my-bookings`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (res.ok) {
        const data = await res.json();
        setMyBookings(data);
      }
    } catch (error) {
      console.error('Failed to fetch bookings');
    } finally {
      setIsLoading(false);
    }
  };

  // Sample accommodation listings (unchanged)
  const accommodations = [
    {
      id: 1,
      name: 'Sunrise Student Village',
      location: 'Maseru',
      area: 'Pioneer Mall Area',
      price: 'M650/month',
      priceValue: 650,
      type: 'shared',
      distance: '5 min to NUL',
      amenities: ['WiFi', '24/7 Security', 'Common Room', 'Kitchen', 'Laundry'],
      available: true,
      rooms: 12,
      rating: 4.8,
      image: '🏠',
      description: 'Modern student accommodation with all amenities. Close to shops and transport.'
    },
    {
      id: 2,
      name: 'Mabatho Residence',
      location: 'Maseru',
      area: 'City Center',
      price: 'M850/month',
      priceValue: 850,
      type: 'private',
      distance: '10 min to town',
      amenities: ['WiFi', 'Parking', 'Study Room', 'Security', 'Water Included'],
      available: true,
      rooms: 8,
      rating: 4.5,
      image: '🏘️',
      description: 'Private rooms with study desks. Perfect for focused students.'
    },
    {
      id: 3,
      name: 'Thaba Bosiu Flats',
      location: 'Maseru',
      area: 'Thaba Bosiu',
      price: 'M550/month',
      priceValue: 550,
      type: 'shared',
      distance: '15 min bus to NUL',
      amenities: ['WiFi', 'Security', 'Shared Kitchen'],
      available: true,
      rooms: 6,
      rating: 4.2,
      image: '🏢',
      description: 'Affordable shared accommodation with basic amenities.'
    },
    {
      id: 4,
      name: 'Leribe Student Housing',
      location: 'Leribe',
      area: 'Hlotse',
      price: 'M480/month',
      priceValue: 480,
      type: 'shared',
      distance: 'Near LEC',
      amenities: ['WiFi', 'Water', 'Security', 'Study Area'],
      available: true,
      rooms: 10,
      rating: 4.3,
      image: '🏠',
      description: 'Comfortable housing for LEC and other institutions students.'
    },
    {
      id: 5,
      name: 'Butha-Buthe Apartments',
      location: 'Butha-Buthe',
      area: 'Town Center',
      price: 'M700/month',
      priceValue: 700,
      type: 'private',
      distance: 'Central location',
      amenities: ['WiFi', 'Parking', 'Security', 'Private Bathroom'],
      available: false,
      rooms: 5,
      rating: 4.7,
      image: '🏘️',
      description: 'Private apartments with all utilities included.'
    },
    {
      id: 6,
      name: 'Mohale\'s Hoek Lodge',
      location: 'Mohale\'s Hoek',
      area: 'Central',
      price: 'M600/month',
      priceValue: 600,
      type: 'private',
      distance: 'Near schools',
      amenities: ['WiFi', 'Security', 'Parking', 'Meal Plan Option'],
      available: true,
      rooms: 8,
      rating: 4.6,
      image: '🏨',
      description: 'Lodge-style accommodation with meal options available.'
    },
    {
      id: 7,
      name: 'NUL Campus View',
      location: 'Maseru',
      area: 'Roma',
      price: 'M950/month',
      priceValue: 950,
      type: 'private',
      distance: 'Walking distance to NUL',
      amenities: ['WiFi', '24/7 Security', 'Study Room', 'Laundry', 'Parking'],
      available: true,
      rooms: 15,
      rating: 4.9,
      image: '🏫',
      description: 'Premium accommodation right next to NUL campus.'
    },
    {
      id: 8,
      name: 'Teyateyaneng Student Homes',
      location: 'Teyateyaneng',
      area: 'Town',
      price: 'M450/month',
      priceValue: 450,
      type: 'shared',
      distance: 'Near bus stop',
      amenities: ['WiFi', 'Shared Kitchen', 'Basic Security'],
      available: true,
      rooms: 8,
      rating: 4.0,
      image: '🏠',
      description: 'Budget-friendly shared accommodation for students.'
    }
  ];

  // Filter accommodations
  const filteredAccommodations = accommodations.filter(acc => {
    if (selectedLocation !== 'all' && acc.location !== selectedLocation) return false;
    if (priceRange === 'low' && acc.priceValue > 700) return false;
    if (priceRange === 'medium' && (acc.priceValue < 700 || acc.priceValue > 850)) return false;
    if (priceRange === 'high' && acc.priceValue < 850) return false;
    if (selectedType !== 'all' && acc.type !== selectedType) return false;
    return true;
  });

  const locations = ['all', ...new Set(accommodations.map(a => a.location))];

  const handleBookNow = (property) => {
    if (!isLoggedIn) {
      const confirmLogin = window.confirm(
        'You need to be logged in to book accommodation.\n\nWould you like to log in or create an account?'
      );
      if (confirmLogin) {
        sessionStorage.setItem('pendingBooking', JSON.stringify(property));
        navigate('/login', { state: { from: '/accommodation', action: 'book', propertyId: property.id } });
      }
      return;
    }
    setSelectedProperty(property);
    setSubmitError('');
    setShowBookingModal(true);
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    
    if (!isLoggedIn) {
      alert('Please log in to complete your booking.');
      navigate('/login', { state: { from: '/accommodation' } });
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError('');
    
    const formData = {
      accommodation_id: selectedProperty.id,
      full_name: e.target.full_name.value,
      email: e.target.email.value,
      phone: e.target.phone.value,
      student_id: e.target.student_id.value,
      institution: e.target.institution.value,
      move_in_date: e.target.move_in_date.value,
      duration: e.target.duration.value
    };
    
    try {
      const token = localStorage.getItem('access_token');
      // ✅ FIXED: include /api/v1
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/accommodation/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      
      if (res.ok) {
        if (activeTab === 'bookings') {
          fetchMyBookings();
        }
        setBookingSubmitted(true);
        setTimeout(() => {
          setShowBookingModal(false);
          setBookingSubmitted(false);
          setSelectedProperty(null);
          e.target.reset();
        }, 3000);
      } else {
        if (res.status === 401) {
          setSubmitError('Your session has expired. Please log in again.');
          setTimeout(() => navigate('/login'), 2000);
        } else if (res.status === 400) {
          setSubmitError(data.detail || 'Please check your information and try again.');
        } else if (res.status === 409) {
          setSubmitError('This accommodation is no longer available. Please try another one.');
        } else if (res.status === 429) {
          setSubmitError('Too many requests. Please wait a moment before trying again.');
        } else {
          setSubmitError('Unable to complete your booking. Please try again later.');
        }
      }
    } catch (error) {
      setSubmitError('Unable to connect to the server. Please check your internet connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="accommodation-page">
      <div className="accommodation-container">
        {/* Hero Section */}
        <div 
          className="accommodation-hero"
          style={{
            backgroundImage: `linear-gradient(135deg, rgba(102, 126, 234, 0.7), rgba(118, 75, 162, 0.7)), url(${accommodationHeroBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
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
            Find Accommodation
          </button>
          <button 
            className={`tab ${activeTab === 'bookings' ? 'active' : ''}`}
            onClick={() => setActiveTab('bookings')}
          >
            My Bookings ({myBookings.length})
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
                  <option value="medium">M700 - M850</option>
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
              Found {filteredAccommodations.length} accommodation{filteredAccommodations.length !== 1 ? 's' : ''}
            </div>

            <div className="accommodation-grid">
              {filteredAccommodations.map(acc => (
                <div key={acc.id} className="accommodation-card">
                  <div className="card-image">
                    <span className="property-icon">{acc.image}</span>
                    {!acc.available && <span className="unavailable-badge">Fully Booked</span>}
                    <div className="rating-badge">⭐ {acc.rating}</div>
                  </div>
                  <div className="card-content">
                    <div className="card-header">
                      <h3>{acc.name}</h3>
                      <span className="property-type">{acc.type === 'shared' ? 'Shared' : 'Private'}</span>
                    </div>
                    <p className="location">📍 {acc.location} • {acc.area}</p>
                    <p className="distance">🚶 {acc.distance}</p>
                    <p className="price">{acc.price}<span>/month</span></p>
                    <div className="amenities">
                      {acc.amenities.slice(0, 3).map((item, idx) => (
                        <span key={idx} className="amenity-tag">{item}</span>
                      ))}
                      {acc.amenities.length > 3 && (
                        <span className="amenity-tag more">+{acc.amenities.length - 3}</span>
                      )}
                    </div>
                    <p className="description">{acc.description.substring(0, 80)}...</p>
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

            {filteredAccommodations.length === 0 && (
              <div className="empty-state">
                <div className="empty-icon">🔍</div>
                <h3>No accommodations found</h3>
                <p>Try adjusting your filters to see more options</p>
                <button onClick={() => {
                  setSelectedLocation('all');
                  setPriceRange('all');
                  setSelectedType('all');
                }} className="reset-btn">
                  Reset Filters
                </button>
              </div>
            )}

            <div className="info-section">
              <h3>📋 How It Works</h3>
              <div className="steps">
                <div className="step">
                  <div className="step-number">1</div>
                  <h4>Browse Listings</h4>
                  <p>Find accommodation that fits your needs</p>
                </div>
                <div className="step">
                  <div className="step-number">2</div>
                  <h4>Submit Booking</h4>
                  <p>Fill in your details and preferred move-in date</p>
                </div>
                <div className="step">
                  <div className="step-number">3</div>
                  <h4>Property Visit</h4>
                  <p>Schedule a visit to view the property</p>
                </div>
                <div className="step">
                  <div className="step-number">4</div>
                  <h4>Sign Contract</h4>
                  <p>Complete paperwork and move in</p>
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
                <p>Please log in to view your bookings</p>
                <button onClick={() => navigate('/login')} className="login-prompt-btn">
                  Login / Sign Up
                </button>
              </div>
            ) : isLoading ? (
              <div className="loading-state">Loading your bookings...</div>
            ) : myBookings.length > 0 ? (
              <div className="bookings-list">
                {myBookings.map(booking => (
                  <div key={booking.id} className="booking-card">
                    <div className="booking-header">
                      <div className="booking-icon">🏠</div>
                      <div className="booking-info">
                        <h3>{booking.propertyName || booking.accommodation?.name || 'Accommodation'}</h3>
                        <p>Booking ID: {booking.id}</p>
                      </div>
                      <span className={`booking-status ${booking.status}`}>
                        {booking.status === 'pending' ? 'Pending' : booking.status === 'confirmed' ? 'Confirmed' : booking.status}
                      </span>
                    </div>
                    <div className="booking-details">
                      <div className="detail-row">
                        <span>Student:</span>
                        <strong>{booking.fullName}</strong>
                      </div>
                      <div className="detail-row">
                        <span>Student ID:</span>
                        <span>{booking.studentId}</span>
                      </div>
                      <div className="detail-row">
                        <span>Institution:</span>
                        <span>{booking.institution}</span>
                      </div>
                      <div className="detail-row">
                        <span>Move-in Date:</span>
                        <span>{booking.moveInDate}</span>
                      </div>
                      <div className="detail-row">
                        <span>Duration:</span>
                        <span>{booking.duration}</span>
                      </div>
                      <div className="detail-row">
                        <span>Booking Date:</span>
                        <span>{booking.bookingDate?.split('T')[0] || booking.bookingDate}</span>
                      </div>
                    </div>
                    <div className="booking-actions">
                      <button className="contact-btn">Contact Landlord</button>
                      <button className="view-details-btn">View Details</button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">📋</div>
                <h3>No Bookings Yet</h3>
                <p>Browse available accommodations and make your first booking</p>
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
              <p>Browse listings, click "Book Now" on your preferred property, then log in or create an account to complete your booking.</p>
            </div>
            <div className="faq-item">
              <h3>Is there a deposit required?</h3>
              <p>Most properties require a refundable deposit equal to one month's rent. This is specified during booking.</p>
            </div>
            <div className="faq-item">
              <h3>Can I view the property before booking?</h3>
              <p>Yes! After submitting a booking request, we'll help arrange a property visit before finalizing the contract.</p>
            </div>
            <div className="faq-item">
              <h3>What documents do I need?</h3>
              <p>Student ID, proof of registration, and a valid ID/passport are required for all bookings.</p>
            </div>
            <div className="faq-item">
              <h3>Are utilities included?</h3>
              <p>Most accommodations include water and basic WiFi. Electricity may be separate - check individual listings.</p>
            </div>
            <div className="faq-item">
              <h3>Can I cancel my booking?</h3>
              <p>Cancellation policies vary by property. Contact our support team for assistance with cancellations.</p>
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
                  <p><strong>💰 Price:</strong> {selectedProperty.price}</p>
                  <p><strong>🏘️ Type:</strong> {selectedProperty.type === 'shared' ? 'Shared Room' : 'Private Room'}</p>
                </div>
                
                {submitError && (
                  <div className="error-message">
                    {submitError}
                  </div>
                )}
                
                <form onSubmit={handleBookingSubmit} className="booking-form">
                  <div className="form-row">
                    <input type="text" name="full_name" placeholder="Full Name" required />
                    <input type="email" name="email" placeholder="Email Address" required />
                  </div>
                  
                  <div className="form-row">
                    <input type="tel" name="phone" placeholder="Phone Number" required />
                    <input type="text" name="student_id" placeholder="Student ID" required />
                  </div>
                  
                  <div className="form-row">
                    <select name="institution" required>
                      <option value="">Select Institution</option>
                      <option value="NUL">National University of Lesotho</option>
                      <option value="LEC">Lesotho Evangelical Church</option>
                      <option value="Limkokwing">Limkokwing University</option>
                      <option value="Botho">Botho University</option>
                      <option value="Other">Other Institution</option>
                    </select>
                    
                    <input type="date" name="move_in_date" required />
                  </div>
                  
                  <div className="form-row">
                    <select name="duration" required>
                      <option value="">Preferred Duration</option>
                      <option value="1 month">1 month</option>
                      <option value="3 months">3 months</option>
                      <option value="6 months">6 months</option>
                      <option value="12 months">12 months</option>
                    </select>
                    
                    <select name="preferred_visit">
                      <option value="">Preferred Visit Time</option>
                      <option value="morning">Morning (9am - 12pm)</option>
                      <option value="afternoon">Afternoon (2pm - 5pm)</option>
                      <option value="evening">Evening (5pm - 7pm)</option>
                    </select>
                  </div>
                  
                  <div className="checkbox">
                    <input type="checkbox" required />
                    <span>I confirm that I have read and agree to the booking terms and conditions</span>
                  </div>
                  
                  <div className="checkbox">
                    <input type="checkbox" required />
                    <span>I understand that a refundable deposit may be required upon confirmation</span>
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
                <p>Your request for {selectedProperty.name} has been received.</p>
                <p>We will contact you within 24 hours to arrange a property visit.</p>
                <div className="next-steps">
                  <h4>What's Next?</h4>
                  <ul>
                    <li>Check your email for confirmation</li>
                    <li>We'll call to schedule a viewing</li>
                    <li>Bring your student ID and documents to the viewing</li>
                    <li>Sign contract and pay deposit to move in</li>
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