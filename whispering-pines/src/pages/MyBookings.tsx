import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Clock, Search, ArrowRight } from 'lucide-react';
import { api } from '../lib/api';
import './MyBookings.css';

const FADE_UP = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.75, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] } }),
};

interface BookingResult {
  id: string;
  guestFirstName: string;
  guestLastName: string;
  guestEmail: string;
  guestAdults: number;
  guestChildren: number;
  specialRequests: string | null;
  checkIn: string;
  checkOut: string;
  nights: number;
  roomSubtotal: number;
  enhancementsSubtotal: number;
  totalAmountCents: number;
  status: string;
  paidAt: string | null;
  createdAt: string;
  accommodation: {
    id: string;
    name: string;
    type: string;
    slug: string;
    images: string[];
  };
  enhancements: { service: { name: string }; priceSnapshot: number }[];
}

const STATUS_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  confirmed: { bg: 'rgba(44,66,51,0.1)', color: '#2C4233', label: 'Confirmed' },
  pending: { bg: 'rgba(230,126,34,0.1)', color: '#e67e22', label: 'Pending' },
  cancelled: { bg: 'rgba(192,57,43,0.1)', color: '#c0392b', label: 'Cancelled' },
  refunded: { bg: 'rgba(127,140,141,0.1)', color: '#7f8c8d', label: 'Refunded' },
};

// formatDate removed — unused

function formatShortDate(iso: string) {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(iso));
}

const GuestPortal = () => {
  const [email, setEmail] = useState('');
  const [lastName, setLastName] = useState('');
  const [bookings, setBookings] = useState<BookingResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [guestName, setGuestName] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('auto') === 'true') {
      const savedEmail = localStorage.getItem('wp_guest_email');
      const savedLastName = localStorage.getItem('wp_guest_last_name');
      if (savedEmail && savedLastName) {
        setEmail(savedEmail);
        setLastName(savedLastName);
        setLoading(true);
        api.post<{ bookings: BookingResult[] }>('/bookings/lookup', { email: savedEmail, lastName: savedLastName })
          .then(data => {
            setBookings(data.bookings);
            setSearched(true);
            if (data.bookings.length > 0) {
              setGuestName(data.bookings[0].guestFirstName);
            }
          })
          .catch(err => setError((err as Error).message ?? 'Could not look up bookings.'))
          .finally(() => setLoading(false));
      }
    }
  }, []);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !lastName) return;
    setLoading(true);
    setError(null);
    try {
      const data = await api.post<{ bookings: BookingResult[] }>('/bookings/lookup', { email, lastName });
      setBookings(data.bookings);
      setSearched(true);
      if (data.bookings.length > 0) {
        setGuestName(data.bookings[0].guestFirstName);
      }
    } catch (err) {
      setError((err as Error).message ?? 'Could not look up bookings.');
    } finally {
      setLoading(false);
    }
  };

  const upcoming = bookings.filter((b) => new Date(b.checkIn) >= new Date() && b.status !== 'cancelled' && b.status !== 'refunded');
  const past = bookings.filter((b) => new Date(b.checkIn) < new Date() || b.status === 'cancelled' || b.status === 'refunded');

  return (
    <div style={{ paddingTop: '100px', minHeight: '85vh' }}>
      {/* Hero lookup section */}
      {!searched ? (
        <div style={{
          minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative', overflow: 'hidden',
        }}>
          <img
            src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1400"
            alt="Morning mist"
            style={{
              position: 'absolute', inset: 0, width: '100%', height: '100%',
              objectFit: 'cover', filter: 'brightness(0.3)',
            }}
          />
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{
              position: 'relative', zIndex: 2, width: '100%', maxWidth: 480,
              padding: '3rem 2rem', textAlign: 'center',
            }}>
            <span style={{
              fontFamily: 'var(--font-body)', fontSize: '0.7rem', letterSpacing: '0.3em',
              textTransform: 'uppercase', color: 'rgba(244,244,243,0.5)',
            }}>
              Welcome Back
            </span>
            <h1 style={{
              fontFamily: 'var(--font-heading)', fontWeight: 300,
              fontSize: 'clamp(2rem, 5vw, 3rem)', color: '#F4F4F3',
              margin: '0.5rem 0 1rem',
            }}>
              Guest Portal
            </h1>
            <p style={{
              fontFamily: 'var(--font-body)', fontSize: '0.95rem', color: 'rgba(244,244,243,0.6)',
              marginBottom: '2.5rem', lineHeight: 1.7,
            }}>
              Enter the email and last name you used when booking to view your reservations.
            </p>

            <form onSubmit={handleLookup} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: '100%', padding: '1rem 1.25rem',
                  border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.08)',
                  color: '#F4F4F3', fontFamily: 'var(--font-body)', fontSize: '0.95rem',
                  outline: 'none', backdropFilter: 'blur(4px)',
                }}
              />
              <input
                type="text"
                placeholder="Last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                style={{
                  width: '100%', padding: '1rem 1.25rem',
                  border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.08)',
                  color: '#F4F4F3', fontFamily: 'var(--font-body)', fontSize: '0.95rem',
                  outline: 'none', backdropFilter: 'blur(4px)',
                }}
              />
              {error && (
                <p style={{ color: '#e74c3c', fontSize: '0.85rem', margin: 0, fontFamily: 'var(--font-body)' }}>{error}</p>
              )}
              <button type="submit" className="btn btn-primary" disabled={loading}
                style={{ width: '100%', padding: '1rem', marginTop: '0.25rem', fontSize: '0.85rem' }}>
                {loading ? 'Looking up…' : 'View My Reservations'}
              </button>
            </form>
          </motion.div>
        </div>
      ) : (
        /* Results */
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 2rem 5rem' }}>
          {/* Greeting */}
          <motion.div variants={FADE_UP} initial="hidden" animate="visible" custom={0}
            style={{ marginBottom: '2.5rem' }}>
            <button onClick={() => { setSearched(false); setBookings([]); setGuestName(''); }}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--color-secondary)',
                display: 'flex', alignItems: 'center', gap: 4, marginBottom: '1.5rem', padding: 0,
              }}>
              <Search size={14} /> Look up different email
            </button>
            {bookings.length > 0 ? (
              <>
                <h1 style={{
                  fontFamily: 'var(--font-heading)', fontWeight: 300,
                  fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', color: 'var(--color-primary)',
                  marginBottom: '0.25rem',
                }}>
                  Welcome back, {guestName}.
                </h1>
                <p style={{ fontFamily: 'var(--font-body)', color: 'var(--color-gray)', fontSize: '0.95rem' }}>
                  You have {bookings.length} reservation{bookings.length !== 1 ? 's' : ''} with us.
                </p>
              </>
            ) : (
              <>
                <h1 style={{
                  fontFamily: 'var(--font-heading)', fontWeight: 300,
                  fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', color: 'var(--color-primary)',
                  marginBottom: '1rem',
                }}>
                  No reservations found
                </h1>
                <p style={{ fontFamily: 'var(--font-body)', color: 'var(--color-gray)', marginBottom: '2rem', lineHeight: 1.7 }}>
                  We couldn't find any bookings matching that email and last name. Please double-check your details, or book your first stay with us.
                </p>
                <Link to="/book" className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>
                  Book Your Stay
                </Link>
              </>
            )}
          </motion.div>

          {/* Upcoming */}
          {upcoming.length > 0 && (
            <div style={{ marginBottom: '3rem' }}>
              <h2 style={{
                fontFamily: 'var(--font-heading)', fontWeight: 400, fontSize: '1.3rem',
                color: 'var(--color-primary)', marginBottom: '1.25rem',
                paddingBottom: '0.75rem', borderBottom: '1px solid rgba(44,66,51,0.1)',
                display: 'flex', alignItems: 'center', gap: '0.5rem',
              }}>
                <Calendar size={18} style={{ color: 'var(--color-secondary)' }} /> Upcoming Stays
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {upcoming.map((b, i) => <BookingCard key={b.id} booking={b} index={i} />)}
              </div>
            </div>
          )}

          {/* Past */}
          {past.length > 0 && (
            <div>
              <h2 style={{
                fontFamily: 'var(--font-heading)', fontWeight: 400, fontSize: '1.3rem',
                color: 'var(--color-primary)', marginBottom: '1.25rem',
                paddingBottom: '0.75rem', borderBottom: '1px solid rgba(44,66,51,0.1)',
              }}>
                Past Reservations
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {past.map((b, i) => <BookingCard key={b.id} booking={b} index={i} isPast />)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

function BookingCard({ booking: b, index, isPast }: { booking: BookingResult; index: number; isPast?: boolean }) {
  const statusStyle = STATUS_STYLES[b.status] ?? STATUS_STYLES.pending;

  return (
    <motion.div variants={FADE_UP} initial="hidden" animate="visible" custom={index}
      className="booking-card"
      style={{ opacity: isPast ? 0.75 : 1 }}>
      <div className="booking-card-image">
        <img
          src={b.accommodation.images[0]}
          alt={b.accommodation.name}
        />
        <span className="booking-card-status" style={{ background: statusStyle.bg, color: statusStyle.color }}>
          {statusStyle.label}
        </span>
      </div>

      <div className="booking-card-content">
        <div className="booking-card-header">
          <div>
            <h3 style={{
              fontFamily: 'var(--font-heading)', fontWeight: 400, fontSize: '1.4rem',
              color: 'var(--color-primary)', marginBottom: '0.2rem', textTransform: 'none'
            }}>
              {b.accommodation.name}
            </h3>
            <span style={{
              fontFamily: 'var(--font-body)', fontSize: '0.7rem', textTransform: 'uppercase',
              letterSpacing: '0.15em', color: 'var(--color-secondary)',
            }}>
              {b.accommodation.type.replace('-', ' ')}
            </span>
          </div>
          <div className="booking-price-badge">
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: 'var(--color-primary)' }}>
              ${(b.totalAmountCents / 100).toLocaleString('en-US')}
            </span>
          </div>
        </div>

        <div style={{
          display: 'flex', gap: '1.5rem', flexWrap: 'wrap', margin: '0.5rem 0 1rem',
          fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--color-gray)',
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Calendar size={14} /> {formatShortDate(b.checkIn)} → {formatShortDate(b.checkOut)}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Clock size={14} /> {b.nights} night{b.nights !== 1 ? 's' : ''}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Users size={14} /> {b.guestAdults + b.guestChildren} guest{(b.guestAdults + b.guestChildren) !== 1 ? 's' : ''}
          </span>
        </div>

        {b.enhancements.length > 0 && (
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--color-gray)', marginBottom: '0.75rem' }}>
            <strong style={{ color: 'var(--color-primary)' }}>Add-ons:</strong> {b.enhancements.map((e) => e.service.name).join(' · ')}
          </p>
        )}

        {b.specialRequests && (
          <p style={{
            padding: '0.75rem 1rem', background: 'rgba(44,66,51,0.03)', borderLeft: '2px solid rgba(44,66,51,0.2)',
            fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--color-gray)',
            fontStyle: 'italic', marginTop: '0.5rem',
          }}>
            <MapPin size={12} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle', marginTop: '-2px' }} />
            {b.specialRequests}
          </p>
        )}

        <div style={{ marginTop: 'auto', paddingTop: '1.5rem' }}>
          <Link to={`/accommodations/${b.accommodation.slug}`}
            style={{
              fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--color-secondary)',
              textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6,
              textTransform: 'uppercase', letterSpacing: '0.05em'
            }}>
            View Details <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default GuestPortal;
