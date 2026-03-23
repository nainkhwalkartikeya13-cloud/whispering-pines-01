import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Calendar, Users, Check, Car, Wine, Sparkles, Utensils, ChevronLeft, Lock, CreditCard } from 'lucide-react';
import { api } from '../lib/api';
import './Booking.css';


interface Accommodation {
  id: string;
  slug: string;
  name: string;
  type: string;
  description: string;
  sqft: number | null;
  maxGuests: number;
  pricePerNight: number;
  images: string[];
  amenityTags: string[];
}

interface AddOn {
  id: string;
  name: string;
  price: number;
  description: string;
}

interface GuestDetails {
  firstName: string;
  lastName: string;
  email: string;
  specialRequests: string;
}

const ADDON_ICONS: Record<string, React.ElementType> = {
  'Airport Limousine Transfer': Car,
  'Chilled Champagne on Arrival': Wine,
  'Couples Spa Treatment': Sparkles,
  'Private Chef Dinner': Utensils,
};

const Booking = () => {
  const location = useLocation();
  const initialState = location.state as {
    dateRange: [Date | null, Date | null];
    guests: { adults: number; children: number };
    preSelectedRoom?: string;
  } | null;

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Dates & guests
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>(
    initialState?.dateRange ?? [null, null]
  );
  const [startDate, endDate] = dateRange;
  const [guests, setGuests] = useState(initialState?.guests ?? { adults: 2, children: 0 });
  const [isGuestDropdownOpen, setIsGuestDropdownOpen] = useState(false);
  const [nights, setNights] = useState(1);

  // Rooms & add-ons
  const [availableRooms, setAvailableRooms] = useState<Accommodation[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const selectedRoom = availableRooms.find((r) => r.id === selectedRoomId);

  const [addOns, setAddOns] = useState<AddOn[]>([]);
  const [selectedAddOnIds, setSelectedAddOnIds] = useState<string[]>([]);

  // Guest details form
  const [guestDetails, setGuestDetails] = useState<GuestDetails>({
    firstName: '', lastName: '', email: '', specialRequests: '',
  });

  // Payment state
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [breakdown, setBreakdown] = useState<{
    roomSubtotal: number;
    enhancementsSubtotal: number;
    total: number;
    nights: number;
  } | null>(null);

  // Derived totals (pre-order, for sidebar display)
  const roomTotal = selectedRoom ? selectedRoom.pricePerNight * nights : 0;
  const addOnsTotal = selectedAddOnIds.reduce((sum, id) => {
    const a = addOns.find((x) => x.id === id);
    return sum + (a ? a.price : 0);
  }, 0);
  const grandTotal = roomTotal + addOnsTotal;

  useEffect(() => {
    api.get<{ services: AddOn[] }>('/services?category=add-on')
      .then((data) => setAddOns(data.services))
      .catch(console.error);
  }, []);

  // Auto-select room when navigating from accommodation detail page
  useEffect(() => {
    if (initialState?.preSelectedRoom && availableRooms.length > 0) {
      const match = availableRooms.find((r) => r.id === initialState.preSelectedRoom);
      if (match) {
        setSelectedRoomId(match.id);
      }
    }
  }, [availableRooms, initialState?.preSelectedRoom]);

  const handleSearch = async () => {
    if (!startDate || !endDate) {
      setSearchError('Please select check-in and check-out dates.');
      return;
    }
    setIsSearching(true);
    setSearchError(null);
    try {
      const data = await api.post<{ accommodations: Accommodation[]; nights: number }>(
        '/bookings/check-availability',
        { checkIn: startDate.toISOString(), checkOut: endDate.toISOString(), guests }
      );
      setAvailableRooms(data.accommodations);
      setNights(data.nights);
      setStep(2);
    } catch (err) {
      setSearchError((err as Error).message ?? 'Could not check availability. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const toggleAddOn = (id: string) => {
    setSelectedAddOnIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleProceedToPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoom || !startDate || !endDate) return;

    setIsCreatingOrder(true);
    setOrderError(null);

    try {
      // Create a Stripe Checkout Session on the backend
      const data = await api.post<{
        url: string;
        breakdown: { roomSubtotal: number; enhancementsSubtotal: number; total: number; nights: number };
      }>('/payments/create-checkout-session', {
        accommodationId: selectedRoom.id,
        checkIn: startDate.toISOString(),
        checkOut: endDate.toISOString(),
        guests,
        selectedServiceIds: selectedAddOnIds,
        guestFirstName: guestDetails.firstName,
        guestLastName: guestDetails.lastName,
        guestEmail: guestDetails.email,
        specialRequests: guestDetails.specialRequests || undefined,
      });

      setBreakdown(data.breakdown);

      // Redirect to Stripe-hosted Checkout page
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned. Please try again.');
      }
    } catch (err) {
      setOrderError((err as Error).message ?? 'Could not initialize payment. Please try again.');
      setIsCreatingOrder(false);
    }
  };

  return (
    <div className="engine-container">
      {/* Step Tracker */}
      <div className="engine-tracker">
        <div className="container">
          <div className="tracker-steps">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className={`tracker-step ${step >= s ? 'active' : ''} ${step === s ? 'current' : ''}`}>
                <div className="tracker-dot" />
                <span className="tracker-label">
                  {s === 1 && 'Dates'}{s === 2 && 'Suite'}{s === 3 && 'Enhance'}{s === 4 && 'Checkout'}
                </span>
              </div>
            ))}
            <div className="tracker-line" style={{ width: `${((step - 1) / 3) * 100}%` }} />
          </div>
        </div>
      </div>

      <div className="container engine-main">
        <AnimatePresence mode="wait">

          {/* STEP 1: Dates */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="engine-step engine-step-1">
              <h1 className="engine-title">Select Your Dates</h1>
              <div className="engine-search-bar">
                <div className="search-field">
                  <label>Check-in — Check-out</label>
                  <div className="search-input-wrapper">
                    <Calendar size={18} />
                    <DatePicker
                      selectsRange
                      startDate={startDate}
                      endDate={endDate}
                      onChange={(update) => setDateRange(update)}
                      placeholderText="Select Dates"
                      className="search-datepicker"
                      dateFormat="MMMM d, yyyy"
                      minDate={new Date()}
                    />
                  </div>
                </div>
                <div className="search-divider" />
                <div className="search-field guest-field">
                  <label>Guests</label>
                  <div className="search-input-wrapper" onClick={() => setIsGuestDropdownOpen(!isGuestDropdownOpen)}>
                    <Users size={18} />
                    <span>{guests.adults} Adults, {guests.children} Children</span>
                  </div>
                  {isGuestDropdownOpen && (
                    <div className="guest-dropdown">
                      <div className="guest-row">
                        <span>Adults</span>
                        <div className="guest-controls">
                          <button onClick={(e) => { e.stopPropagation(); setGuests({ ...guests, adults: Math.max(1, guests.adults - 1) }); }}>-</button>
                          <span>{guests.adults}</span>
                          <button onClick={(e) => { e.stopPropagation(); setGuests({ ...guests, adults: guests.adults + 1 }); }}>+</button>
                        </div>
                      </div>
                      <div className="guest-row">
                        <span>Children</span>
                        <div className="guest-controls">
                          <button onClick={(e) => { e.stopPropagation(); setGuests({ ...guests, children: Math.max(0, guests.children - 1) }); }}>-</button>
                          <span>{guests.children}</span>
                          <button onClick={(e) => { e.stopPropagation(); setGuests({ ...guests, children: guests.children + 1 }); }}>+</button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <button className={`btn btn-primary search-btn ${isSearching ? 'pulsing' : ''}`} onClick={handleSearch} disabled={isSearching}>
                  {isSearching ? 'Checking...' : 'Check Availability'}
                </button>
              </div>
              {searchError && <p style={{ color: '#c0392b', marginTop: '16px', textAlign: 'center' }}>{searchError}</p>}
            </motion.div>
          )}

          {/* STEP 2: Room Selection */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="engine-step engine-step-2">
              <h1 className="engine-title">Available Sanctuaries</h1>
              {availableRooms.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                  <p style={{ opacity: 0.6, fontFamily: 'var(--font-heading)', fontSize: '1.4rem' }}>No availability for those dates.</p>
                  <button className="btn btn-outline" style={{ marginTop: '24px' }} onClick={() => setStep(1)}>Try Different Dates</button>
                </div>
              ) : (
                <div className="rooms-list">
                  {availableRooms.map((room) => (
                    <div className="luxury-room-card" key={room.id}>
                      <div className="room-carousel">
                        <img src={room.images[0] ?? 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800'} alt={room.name} />
                      </div>
                      <div className="room-info">
                        <div className="room-info-header">
                          <h2>{room.name}</h2>
                          {room.sqft && <div className="room-sqft">{room.sqft} SQ FT</div>}
                        </div>
                        <p className="room-description">{room.description}</p>
                        {room.amenityTags.length > 0 && (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                            {room.amenityTags.map((tag) => (
                              <span key={tag} style={{ fontSize: '0.75rem', padding: '3px 10px', border: '1px solid rgba(44,66,51,0.2)', color: 'var(--color-secondary)', fontFamily: 'var(--font-body)', letterSpacing: '0.5px' }}>
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                        <div className="room-footer">
                          <div className="room-pricing">
                            <span className="price-label">Starting From</span>
                            <span className="price-amount">${room.pricePerNight.toLocaleString('en-US')}</span>
                            <span className="price-night">/ night</span>
                          </div>
                          <div className="room-actions">
                            <button className="btn btn-primary" onClick={() => { setSelectedRoomId(room.id); setStep(3); }}>
                              Select Suite
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* STEP 3: Enhancements */}
          {step === 3 && selectedRoom && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="engine-step engine-layout-sidebar">
              <div className="engine-main-area">
                <button className="back-btn" onClick={() => setStep(2)}><ChevronLeft size={16} /> Back to Suites</button>
                <h1 className="engine-title">Enhance Your Stay</h1>
                <p className="engine-subtitle">Curate your experience with our signature enhancements.</p>
                <div className="amenities-grid">
                  {addOns.map((addon) => {
                    const isSelected = selectedAddOnIds.includes(addon.id);
                    const Icon = ADDON_ICONS[addon.name] ?? Sparkles;
                    return (
                      <div key={addon.id} className={`amenity-card ${isSelected ? 'selected' : ''}`} onClick={() => toggleAddOn(addon.id)}>
                        <div className="amenity-icon"><Icon size={24} strokeWidth={1} /></div>
                        <div className="amenity-details">
                          <h3>{addon.name}</h3>
                          <span>+${addon.price.toLocaleString('en-US')}</span>
                        </div>
                        <div className="amenity-check">{isSelected && <Check size={18} />}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="engine-sidebar">
                <div className="summary-card">
                  <h3>Your Reservation</h3>
                  <div className="summary-section">
                    <h4>{selectedRoom.name}</h4>
                    <p>{startDate?.toLocaleDateString()} — {endDate?.toLocaleDateString() ?? '…'} ({nights} Night{nights !== 1 ? 's' : ''})</p>
                    <div className="summary-line">
                      <span>Suite Total</span>
                      <span>${roomTotal.toLocaleString('en-US')}</span>
                    </div>
                  </div>
                  {selectedAddOnIds.length > 0 && (
                    <div className="summary-section">
                      <h4>Enhancements</h4>
                      {selectedAddOnIds.map((id) => {
                        const a = addOns.find((x) => x.id === id);
                        return (
                          <div className="summary-line" key={id}>
                            <span>{a?.name}</span>
                            <span>${a?.price.toLocaleString('en-US')}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  <div className="summary-total">
                    <span>Total Estimated</span>
                    <span>${grandTotal.toLocaleString('en-US')}</span>
                  </div>
                  <button className="btn btn-primary summary-btn" onClick={() => setStep(4)}>Continue to Guest Details</button>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 4: Checkout */}
          {step === 4 && selectedRoom && (
            <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="engine-step engine-layout-sidebar">
              <div className="engine-main-area">
                <button className="back-btn" onClick={() => setStep(3)}><ChevronLeft size={16} /> Back to Enhancements</button>
                <h1 className="engine-title">Guest Details</h1>

                <form className="checkout-form" onSubmit={handleProceedToPayment}>
                  <div className="form-section">
                    <h3>Personal Information</h3>
                    <div className="form-grid">
                      <div className="input-group">
                        <label>First Name</label>
                        <input type="text" placeholder="e.g. John" required value={guestDetails.firstName} onChange={(e) => setGuestDetails({ ...guestDetails, firstName: e.target.value })} />
                      </div>
                      <div className="input-group">
                        <label>Last Name</label>
                        <input type="text" placeholder="e.g. Smith" required value={guestDetails.lastName} onChange={(e) => setGuestDetails({ ...guestDetails, lastName: e.target.value })} />
                      </div>
                      <div className="input-group full-width">
                        <label>Email Address</label>
                        <input type="email" placeholder="john@example.com" required value={guestDetails.email} onChange={(e) => setGuestDetails({ ...guestDetails, email: e.target.value })} />
                      </div>
                      <div className="input-group full-width">
                        <label>Special Requests</label>
                        <textarea placeholder="Any dietary requirements or special occasions?" rows={3} value={guestDetails.specialRequests} onChange={(e) => setGuestDetails({ ...guestDetails, specialRequests: e.target.value })} />
                      </div>
                    </div>
                  </div>

                  <div className="form-section">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '16px', background: 'rgba(44,66,51,0.06)', border: '1px solid rgba(44,66,51,0.15)', marginBottom: '8px' }}>
                      <Lock size={15} style={{ color: 'var(--color-secondary)', flexShrink: 0 }} />
                      <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--color-secondary)', margin: 0 }}>
                        Payment is processed securely via <strong>Stripe</strong>. You'll be redirected to a secure checkout page to complete your payment.
                      </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.45, marginTop: '8px' }}>
                      <CreditCard size={13} />
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', letterSpacing: '1px' }}>Visa · Mastercard · Amex · Apple Pay · Google Pay</span>
                    </div>
                  </div>

                  {orderError && <p style={{ color: '#c0392b', marginBottom: '16px', fontSize: '0.9rem' }}>{orderError}</p>}

                  <button type="submit" className="btn btn-primary" disabled={isCreatingOrder} style={{ width: '100%' }}>
                    {isCreatingOrder ? 'Redirecting to Checkout…' : `Pay $${grandTotal.toLocaleString('en-US')}`}
                  </button>
                </form>
              </div>

              <div className="engine-sidebar">
                <div className="summary-card">
                  <h3>Complete Reservation</h3>
                  <div className="summary-section">
                    <h4>{selectedRoom.name}</h4>
                    <p>{startDate?.toLocaleDateString()} — {endDate?.toLocaleDateString() ?? '…'} ({nights} Night{nights !== 1 ? 's' : ''})</p>
                    {breakdown ? (
                      <>
                        <div className="summary-line"><span>Suite</span><span>${breakdown.roomSubtotal.toLocaleString('en-US')}</span></div>
                        {breakdown.enhancementsSubtotal > 0 && <div className="summary-line"><span>Enhancements</span><span>${breakdown.enhancementsSubtotal.toLocaleString('en-US')}</span></div>}
                      </>
                    ) : null}
                  </div>
                  <div className="summary-total">
                    <span>Total</span>
                    <span>${(breakdown ? breakdown.total : grandTotal).toLocaleString('en-US')}</span>
                  </div>
                  <p className="summary-terms">By confirming, you agree to our Terms of Service and Cancellation Policy.</p>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
};

export default Booking;
