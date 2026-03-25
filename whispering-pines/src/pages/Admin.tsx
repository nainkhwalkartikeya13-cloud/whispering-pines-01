import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings, Plus, Edit2, Trash2, Tag, Home, ShoppingBag, LogOut, X,
  BarChart3, CalendarCheck, Star, MessageSquare, Building, Eye, EyeOff, Check,
  Mail, ImagePlus, Save, ChevronDown, RefreshCw, Search, DollarSign,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import './Admin.css';

/* ═══════════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════════ */
interface Service {
  id: string; name: string; category: 'accommodation' | 'add-on' | 'merchandise';
  price: number; priceType: 'per_night' | 'one_time'; description: string; isActive: boolean;
}
interface Booking {
  id: string; guestFirstName: string; guestLastName: string; guestEmail: string;
  guestAdults: number; guestChildren: number; specialRequests: string | null;
  checkIn: string; checkOut: string; nights: number; totalAmountCents: number;
  roomSubtotal: number; enhancementsSubtotal: number;
  status: string; paidAt: string | null; createdAt: string;
  accommodation: { id: string; name: string; type: string };
  enhancements: { service: { name: string }; priceSnapshot: number }[];
}
interface Review {
  id: string; authorName: string; body: string; rating: number; isPublished: boolean; createdAt: string;
}
interface ContactSubmission {
  id: string; name: string; email: string; message: string; isRead: boolean; createdAt: string;
}
interface DashboardStats {
  totalBookings: number; confirmedBookings: number; pendingBookings: number;
  recentBookings: number; totalRevenue: number; totalAccommodations: number;
  totalReviews: number; unreadContacts: number;
}
interface RecentActivity {
  id: string; guestFirstName: string; guestLastName: string; status: string;
  totalAmountCents: number; createdAt: string; accommodation: { name: string };
}
interface AccommodationRaw {
  id: string; slug: string; name: string; type: string; description: string;
  sqft: number | null; pricePerNight: number; maxGuests: number; isActive: boolean;
  images: string[] | string; amenityTags: string[] | string;
}

type Tab = 'dashboard' | 'bookings' | 'services' | 'reviews' | 'contacts' | 'accommodations';

interface AccForm {
  name: string; slug: string; type: string; description: string;
  sqft: string; maxGuests: string; pricePerNight: string;
  images: string; amenityTags: string; isActive: boolean;
}

const BLANK_ACC: AccForm = {
  name: '', slug: '', type: 'yurt', description: '',
  sqft: '', maxGuests: '4', pricePerNight: '',
  images: '', amenityTags: '', isActive: true,
};

const BLANK_SERVICE: Omit<Service, 'id' | 'isActive'> = {
  name: '', category: 'add-on', price: 0, priceType: 'one_time', description: '',
};

const TYPE_OPTIONS = [
  { value: 'yurt', label: 'Luxury Yurt' },
  { value: 'safari-tent', label: 'Safari Tent' },
  { value: 'bell-tent', label: 'Bell Tent' },
  { value: 'campsite', label: 'Forest Campsite' },
];

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  confirmed: { bg: 'rgba(44,66,51,0.1)', color: '#2C4233' },
  pending: { bg: 'rgba(230,126,34,0.1)', color: '#e67e22' },
  cancelled: { bg: 'rgba(192,57,43,0.1)', color: '#c0392b' },
  refunded: { bg: 'rgba(127,140,141,0.1)', color: '#7f8c8d' },
};

/* ═══════════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════════ */
function fmt(iso: string) {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(iso));
}
function cur(cents: number) { return `$${(cents / 100).toLocaleString('en-US')}`; }
function parseImages(v: string[] | string): string[] {
  if (Array.isArray(v)) return v;
  try { return JSON.parse(v) as string[]; } catch { return []; }
}
function parseTags(v: string[] | string): string[] {
  if (Array.isArray(v)) return v;
  try { return JSON.parse(v) as string[]; } catch { return []; }
}

/* ═══════════════════════════════════════════════════════════
   SMALL COMPONENTS
   ═══════════════════════════════════════════════════════════ */
const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 14px', border: '1px solid rgba(0,0,0,0.15)',
  fontFamily: 'var(--font-body)', fontSize: '0.9rem', background: '#fff', outline: 'none',
};
const labelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-body)', fontSize: '0.75rem', fontWeight: 600,
  textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-gray)',
  display: 'block', marginBottom: '6px',
};

function StatCard({ label, value, icon: Icon, accent }: { label: string; value: string | number; icon: React.ElementType; accent?: string }) {
  return (
    <div style={{
      padding: '1.5rem', background: '#fff', border: '1px solid rgba(0,0,0,0.06)',
      borderLeft: `4px solid ${accent ?? 'var(--color-secondary)'}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--color-gray)', marginBottom: '4px' }}>{label}</p>
          <p style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', color: 'var(--color-primary)', margin: 0 }}>{value}</p>
        </div>
        <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(44,66,51,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={20} style={{ color: accent ?? 'var(--color-secondary)' }} />
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_COLORS[status] ?? STATUS_COLORS.pending;
  return (
    <span style={{
      padding: '3px 10px', fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 600,
      letterSpacing: '0.05em', background: s.bg, color: s.color,
    }}>{status}</span>
  );
}

/* ═══════════════════════════════════════════════════════════
   LOGIN
   ═══════════════════════════════════════════════════════════ */
function LoginForm() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); setError(null);
    try { await login(email, password); }
    catch (err) { setError((err as Error).message ?? 'Login failed'); }
    finally { setIsLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f8f7', padding: '24px' }}>
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
        style={{ width: '100%', maxWidth: '420px', background: '#fff', padding: '3rem', border: '1px solid rgba(0,0,0,0.08)' }}>
        <p style={{ fontFamily: 'var(--font-body)', letterSpacing: '4px', fontSize: '10px', textTransform: 'uppercase', opacity: 0.4, marginBottom: '8px', textAlign: 'center' }}>Whispering Pines Retreats</p>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 300, textAlign: 'center', color: 'var(--color-primary)', marginBottom: '2.5rem' }}>Admin Portal</h1>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={labelStyle}>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={inputStyle} />
          </div>
          {error && <p style={{ color: '#c0392b', fontSize: '0.85rem', margin: 0 }}>{error}</p>}
          <button type="submit" className="btn btn-primary" disabled={isLoading} style={{ width: '100%', marginTop: '8px', padding: '12px' }}>
            {isLoading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   ACCOMMODATION FORM (Add / Edit)
   ═══════════════════════════════════════════════════════════ */
function AccommodationForm({ initial, onSave, onCancel, isEditing }: {
  initial: AccForm; onSave: (data: AccForm) => Promise<void>; onCancel: () => void; isEditing: boolean;
}) {
  const [form, setForm] = useState<AccForm>(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const set = (k: keyof AccForm, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }));

  // Auto-generate slug from name
  const handleNameChange = (v: string) => {
    set('name', v);
    if (!isEditing) {
      set('slug', v.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setError(null);
    try { await onSave(form); }
    catch (err) { setError((err as Error).message ?? 'Failed to save'); }
    finally { setSaving(false); }
  };

  const imageList = form.images.split('\n').filter(Boolean);

  return (
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
      style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
      {/* Header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(0,0,0,0.06)', background: 'rgba(44,66,51,0.03)',
      }}>
        <h3 style={{ margin: 0, fontFamily: 'var(--font-heading)', fontWeight: 400, fontSize: '1.2rem' }}>
          {isEditing ? 'Edit Accommodation' : 'Add New Accommodation'}
        </h3>
        <button onClick={onCancel} style={{ background: 'none', border: 'none', cursor: 'pointer', opacity: 0.5 }}><X size={20} /></button>
      </div>

      <form onSubmit={handleSubmit} style={{ padding: '1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
          {/* Name */}
          <div>
            <label style={labelStyle}>Name *</label>
            <input style={inputStyle} value={form.name} onChange={(e) => handleNameChange(e.target.value)} required placeholder="e.g. Pahto Yurt" />
          </div>
          {/* Slug */}
          <div>
            <label style={labelStyle}>Slug (URL) *</label>
            <input style={inputStyle} value={form.slug} onChange={(e) => set('slug', e.target.value)} required placeholder="e.g. pahto-yurt" />
          </div>
          {/* Type */}
          <div>
            <label style={labelStyle}>Type *</label>
            <select style={inputStyle} value={form.type} onChange={(e) => set('type', e.target.value)}>
              {TYPE_OPTIONS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          {/* Price */}
          <div>
            <label style={labelStyle}>Price Per Night ($) *</label>
            <input style={inputStyle} type="number" value={form.pricePerNight} onChange={(e) => set('pricePerNight', e.target.value)} required min={0} step={1} placeholder="5500" />
          </div>
          {/* Max Guests */}
          <div>
            <label style={labelStyle}>Max Guests *</label>
            <input style={inputStyle} type="number" value={form.maxGuests} onChange={(e) => set('maxGuests', e.target.value)} required min={1} max={20} />
          </div>
          {/* Sqft */}
          <div>
            <label style={labelStyle}>Square Feet (optional)</label>
            <input style={inputStyle} type="number" value={form.sqft} onChange={(e) => set('sqft', e.target.value)} min={0} placeholder="450" />
          </div>
          {/* Description */}
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Description *</label>
            <textarea style={{ ...inputStyle, minHeight: 100, resize: 'vertical' }} value={form.description} onChange={(e) => set('description', e.target.value)} required
              placeholder="Describe the accommodation — what makes it special, the view, the furnishings..." />
          </div>
          {/* Images */}
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}><ImagePlus size={12} style={{ display: 'inline', marginRight: 4 }} />Image URLs (one per line)</label>
            <textarea style={{ ...inputStyle, minHeight: 80, resize: 'vertical', fontFamily: 'monospace', fontSize: '0.8rem' }} value={form.images} onChange={(e) => set('images', e.target.value)}
              placeholder="https://images.unsplash.com/photo-...&#10;https://images.unsplash.com/photo-..." />
            {imageList.length > 0 && (
              <div style={{ display: 'flex', gap: '6px', marginTop: '8px', flexWrap: 'wrap' }}>
                {imageList.slice(0, 5).map((url, i) => (
                  <img key={i} src={url} alt={`Preview ${i + 1}`}
                    style={{ width: 64, height: 48, objectFit: 'cover', border: '1px solid rgba(0,0,0,0.1)' }}
                    onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                ))}
                {imageList.length > 5 && (
                  <span style={{ display: 'flex', alignItems: 'center', fontSize: '0.75rem', color: 'var(--color-gray)' }}>+{imageList.length - 5} more</span>
                )}
              </div>
            )}
          </div>
          {/* Amenity Tags */}
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Amenity Tags (comma-separated)</label>
            <input style={inputStyle} value={form.amenityTags} onChange={(e) => set('amenityTags', e.target.value)}
              placeholder="Wood Stove, King Bed, Private Deck, WiFi, Hot Shower" />
            {form.amenityTags && (
              <div style={{ display: 'flex', gap: '4px', marginTop: '8px', flexWrap: 'wrap' }}>
                {form.amenityTags.split(',').filter(Boolean).map((tag, i) => (
                  <span key={i} style={{
                    padding: '2px 8px', fontSize: '0.7rem', border: '1px solid rgba(44,66,51,0.2)',
                    color: 'var(--color-secondary)', fontFamily: 'var(--font-body)',
                  }}>{tag.trim()}</span>
                ))}
              </div>
            )}
          </div>
          {/* Active Toggle */}
          <div>
            <label style={labelStyle}>Status</label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '0.9rem' }}>
              <input type="checkbox" checked={form.isActive} onChange={(e) => set('isActive', e.target.checked)} />
              {form.isActive ? 'Active (visible to guests)' : 'Inactive (hidden)'}
            </label>
          </div>
        </div>

        {error && <p style={{ color: '#c0392b', fontSize: '0.85rem', marginTop: '1rem' }}>{error}</p>}

        <div style={{ display: 'flex', gap: '10px', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
          <button type="submit" className="btn btn-primary btn-sm" disabled={saving} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Save size={14} /> {saving ? 'Saving…' : isEditing ? 'Update Accommodation' : 'Create Accommodation'}
          </button>
          <button type="button" className="btn btn-outline btn-sm" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN ADMIN
   ═══════════════════════════════════════════════════════════ */
const Admin = () => {
  const { isAuthenticated, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');

  // Dashboard
  const [dashStats, setDashStats] = useState<DashboardStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);

  // Services
  const [services, setServices] = useState<Service[]>([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [editServiceForm, setEditServiceForm] = useState<Partial<Service>>({});
  const [showAddService, setShowAddService] = useState(false);
  const [newService, setNewService] = useState({ ...BLANK_SERVICE });
  const [savingServiceId, setSavingServiceId] = useState<string | null>(null);

  // Bookings
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [bookingFilter, setBookingFilter] = useState<string>('all');
  const [expandedBookingId, setExpandedBookingId] = useState<string | null>(null);
  const [bookingSearch, setBookingSearch] = useState('');

  // Reviews
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  // Contacts
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [contactsLoading, setContactsLoading] = useState(false);
  const [expandedContactId, setExpandedContactId] = useState<string | null>(null);

  // Accommodations
  const [accommodations, setAccommodations] = useState<AccommodationRaw[]>([]);
  const [accommodationsLoading, setAccommodationsLoading] = useState(false);
  const [showAccForm, setShowAccForm] = useState(false);
  const [editingAccId, setEditingAccId] = useState<string | null>(null);

  /* ── Fetchers ─────────────────────────────────────────── */
  const fetchDashboard = useCallback(async () => {
    try { const d = await api.get<{ stats: DashboardStats; recentActivity: RecentActivity[] }>('/analytics/dashboard'); setDashStats(d.stats); setRecentActivity(d.recentActivity); }
    catch { /* */ }
  }, []);
  const fetchServices = useCallback(async () => {
    setServicesLoading(true);
    try { const d = await api.get<{ services: Service[] }>('/services'); setServices(d.services); }
    catch { /* */ } finally { setServicesLoading(false); }
  }, []);
  const fetchBookings = useCallback(async () => {
    setBookingsLoading(true);
    try { const d = await api.get<{ bookings: Booking[] }>('/bookings?limit=50'); setBookings(d.bookings); }
    catch { /* */ } finally { setBookingsLoading(false); }
  }, []);
  const fetchReviews = useCallback(async () => {
    setReviewsLoading(true);
    try { const d = await api.get<{ reviews: Review[] }>('/reviews/admin'); setReviews(d.reviews); }
    catch { /* */ } finally { setReviewsLoading(false); }
  }, []);
  const fetchContacts = useCallback(async () => {
    setContactsLoading(true);
    try { const d = await api.get<{ submissions: ContactSubmission[] }>('/contact/submissions'); setContacts(d.submissions); }
    catch { /* */ } finally { setContactsLoading(false); }
  }, []);
  const fetchAccommodations = useCallback(async () => {
    setAccommodationsLoading(true);
    try { const d = await api.get<{ accommodations: AccommodationRaw[] }>('/accommodations'); setAccommodations(d.accommodations); }
    catch { /* */ } finally { setAccommodationsLoading(false); }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    const fetchers: Record<Tab, () => void> = {
      dashboard: fetchDashboard, services: fetchServices, bookings: fetchBookings,
      reviews: fetchReviews, contacts: fetchContacts, accommodations: fetchAccommodations,
    };
    fetchers[activeTab]();
  }, [isAuthenticated, activeTab, fetchDashboard, fetchServices, fetchBookings, fetchReviews, fetchContacts, fetchAccommodations]);

  /* ── Service handlers ──────────────────────────────────── */
  const handleSaveService = async () => {
    if (!editingServiceId) return;
    setSavingServiceId(editingServiceId);
    try { await api.put(`/services/${editingServiceId}`, editServiceForm); await fetchServices(); setEditingServiceId(null); }
    catch (err) { alert((err as Error).message); }
    finally { setSavingServiceId(null); }
  };
  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    try { await api.post('/services', newService); await fetchServices(); setShowAddService(false); setNewService({ ...BLANK_SERVICE }); }
    catch (err) { alert((err as Error).message); }
  };

  /* ── Booking handlers ──────────────────────────────────── */
  const handleStatusChange = async (id: string, status: string) => {
    try { await api.patch(`/bookings/${id}/status`, { status }); await fetchBookings(); }
    catch (err) { alert((err as Error).message); }
  };

  const filteredBookings = bookings
    .filter((b) => bookingFilter === 'all' || b.status === bookingFilter)
    .filter((b) => {
      if (!bookingSearch) return true;
      const q = bookingSearch.toLowerCase();
      return `${b.guestFirstName} ${b.guestLastName}`.toLowerCase().includes(q) ||
        b.guestEmail.toLowerCase().includes(q) ||
        b.accommodation?.name.toLowerCase().includes(q);
    });

  /* ── Accommodation handlers ────────────────────────────── */
  const handleCreateAcc = async (form: AccForm) => {
    const data = {
      name: form.name, slug: form.slug, type: form.type, description: form.description,
      sqft: form.sqft ? Number(form.sqft) : undefined,
      maxGuests: Number(form.maxGuests), pricePerNight: Number(form.pricePerNight),
      images: form.images.split('\n').filter(Boolean),
      amenityTags: form.amenityTags.split(',').map((t) => t.trim()).filter(Boolean),
      isActive: form.isActive,
    };
    await api.post('/accommodations', data);
    await fetchAccommodations();
    setShowAccForm(false);
  };

  const handleUpdateAcc = async (form: AccForm) => {
    if (!editingAccId) return;
    const data = {
      name: form.name, slug: form.slug, type: form.type, description: form.description,
      sqft: form.sqft ? Number(form.sqft) : null,
      maxGuests: Number(form.maxGuests), pricePerNight: Number(form.pricePerNight),
      images: form.images.split('\n').filter(Boolean),
      amenityTags: form.amenityTags.split(',').map((t) => t.trim()).filter(Boolean),
      isActive: form.isActive,
    };
    await api.put(`/accommodations/${editingAccId}`, data);
    await fetchAccommodations();
    setEditingAccId(null);
  };

  const handleDeleteAcc = async (id: string) => {
    if (!confirm('Deactivate this accommodation? It will be hidden from guests.')) return;
    try { await api.delete(`/accommodations/${id}`); await fetchAccommodations(); }
    catch (err) { alert((err as Error).message); }
  };

  const startEditAcc = (a: AccommodationRaw) => {
    setEditingAccId(a.id);
    setShowAccForm(true);
    // form is handled by the AccommodationForm initial prop
  };

  const getEditingAccForm = (): AccForm | null => {
    if (!editingAccId) return null;
    const a = accommodations.find((x) => x.id === editingAccId);
    if (!a) return null;
    return {
      name: a.name, slug: a.slug, type: a.type, description: a.description,
      sqft: a.sqft?.toString() ?? '', maxGuests: a.maxGuests.toString(),
      pricePerNight: a.pricePerNight.toString(),
      images: parseImages(a.images).join('\n'),
      amenityTags: parseTags(a.amenityTags).join(', '),
      isActive: a.isActive,
    };
  };

  const getIcon = (cat: string) => {
    if (cat === 'accommodation') return <Home size={14} />;
    if (cat === 'add-on') return <Tag size={14} />;
    if (cat === 'merchandise') return <ShoppingBag size={14} />;
    return <Settings size={14} />;
  };

  if (!isAuthenticated) return <LoginForm />;

  const TABS: { key: Tab; label: string; icon: React.ElementType; count?: number }[] = [
    { key: 'dashboard', label: 'Overview', icon: BarChart3 },
    { key: 'accommodations', label: 'Stays', icon: Building, count: accommodations.length || undefined },
    { key: 'bookings', label: 'Bookings', icon: CalendarCheck, count: dashStats?.totalBookings },
    { key: 'reviews', label: 'Reviews', icon: Star, count: dashStats?.totalReviews },
    { key: 'contacts', label: 'Messages', icon: MessageSquare, count: dashStats?.unreadContacts || undefined },
    { key: 'services', label: 'Services', icon: Tag },
  ];

  return (
    <motion.div className="admin-page section" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="container" style={{ paddingTop: '100px', minHeight: '85vh', paddingBottom: '4rem' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--color-gray)', marginBottom: '4px' }}>Whispering Pines Retreats</p>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 300, color: 'var(--color-primary)', margin: 0 }}>Management Console</h1>
          </div>
          <button className="btn btn-outline btn-sm" onClick={logout} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <LogOut size={14} /> Sign Out
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 0, borderBottom: '2px solid rgba(0,0,0,0.06)', marginBottom: '2rem', overflowX: 'auto' }}>
          {TABS.map(({ key, label, icon: Icon, count }) => (
            <button key={key} onClick={() => setActiveTab(key)}
              style={{
                padding: '14px 22px', background: 'none', border: 'none',
                borderBottom: activeTab === key ? '2px solid var(--color-secondary)' : '2px solid transparent',
                fontFamily: 'var(--font-body)', fontSize: '0.78rem', letterSpacing: '1px',
                textTransform: 'uppercase', color: activeTab === key ? 'var(--color-secondary)' : 'var(--color-primary)',
                opacity: activeTab === key ? 1 : 0.45, cursor: 'pointer', marginBottom: '-2px',
                display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap', transition: 'all 0.15s',
              }}>
              <Icon size={14} /> {label}
              {count !== undefined && count > 0 && (
                <span style={{ fontSize: '0.65rem', background: 'rgba(44,66,51,0.08)', padding: '1px 6px', borderRadius: '2px' }}>{count}</span>
              )}
            </button>
          ))}
        </div>

        {/* ═══════════ DASHBOARD ═══════════ */}
        {activeTab === 'dashboard' && dashStats && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
              <StatCard label="Total Revenue" value={cur(dashStats.totalRevenue)} icon={DollarSign} accent="#2C4233" />
              <StatCard label="Total Bookings" value={dashStats.totalBookings} icon={CalendarCheck} accent="#3498db" />
              <StatCard label="Confirmed" value={dashStats.confirmedBookings} icon={Check} accent="#27ae60" />
              <StatCard label="Pending" value={dashStats.pendingBookings} icon={RefreshCw} accent="#e67e22" />
              <StatCard label="Last 30 Days" value={dashStats.recentBookings} icon={BarChart3} accent="#8e44ad" />
              <StatCard label="Active Stays" value={dashStats.totalAccommodations} icon={Building} accent="#2C4233" />
              <StatCard label="Guest Reviews" value={dashStats.totalReviews} icon={Star} accent="#f39c12" />
              <StatCard label="Unread Messages" value={dashStats.unreadContacts} icon={Mail} accent={dashStats.unreadContacts > 0 ? '#c0392b' : '#95a5a6'} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 400, fontSize: '1.2rem', margin: 0 }}>Recent Activity</h3>
              <button onClick={() => setActiveTab('bookings')} style={{ background: 'none', border: 'none', color: 'var(--color-secondary)', fontFamily: 'var(--font-body)', fontSize: '0.8rem', cursor: 'pointer' }}>
                View all bookings →
              </button>
            </div>
            <div className="admin-table-container">
              <table className="admin-table">
                <thead><tr><th>Guest</th><th>Stay</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead>
                <tbody>
                  {recentActivity.map((a) => (
                    <tr key={a.id}>
                      <td style={{ fontWeight: 500 }}>{a.guestFirstName} {a.guestLastName}</td>
                      <td>{a.accommodation?.name ?? '—'}</td>
                      <td style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem' }}>{cur(a.totalAmountCents)}</td>
                      <td><StatusBadge status={a.status} /></td>
                      <td style={{ fontSize: '0.8rem', color: 'var(--color-gray)' }}>{fmt(a.createdAt)}</td>
                    </tr>
                  ))}
                  {recentActivity.length === 0 && <tr><td colSpan={5} style={{ textAlign: 'center', padding: '2rem', opacity: 0.5 }}>No activity yet</td></tr>}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* ═══════════ ACCOMMODATIONS ═══════════ */}
        {activeTab === 'accommodations' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--color-gray)', margin: 0 }}>
                {accommodations.length} accommodation{accommodations.length !== 1 ? 's' : ''} total
              </p>
              {!showAccForm && (
                <button className="btn btn-primary btn-sm" onClick={() => { setEditingAccId(null); setShowAccForm(true); }}
                  style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Plus size={14} /> Add Accommodation
                </button>
              )}
            </div>

            {/* Add/Edit Form */}
            <AnimatePresence>
              {showAccForm && (
                <AccommodationForm
                  key={editingAccId ?? 'new'}
                  initial={getEditingAccForm() ?? { ...BLANK_ACC }}
                  onSave={editingAccId ? handleUpdateAcc : handleCreateAcc}
                  onCancel={() => { setShowAccForm(false); setEditingAccId(null); }}
                  isEditing={!!editingAccId}
                />
              )}
            </AnimatePresence>

            {accommodationsLoading ? <p style={{ opacity: 0.5 }}>Loading…</p> : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {accommodations.map((a) => {
                  const imgs = parseImages(a.images);
                  const tags = parseTags(a.amenityTags);
                  return (
                    <div key={a.id} style={{
                      display: 'grid', gridTemplateColumns: '140px 1fr auto',
                      border: '1px solid rgba(0,0,0,0.08)', background: '#fff',
                      opacity: a.isActive ? 1 : 0.6,
                    }}>
                      {/* Thumbnail */}
                      <div style={{ overflow: 'hidden', background: '#eee' }}>
                        {imgs[0] ? (
                          <img src={imgs[0]} alt={a.name} style={{ width: '100%', height: '100%', minHeight: 120, objectFit: 'cover' }} />
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#bbb' }}>
                            <ImagePlus size={24} />
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div style={{ padding: '1.25rem 1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
                          <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 400, fontSize: '1.15rem', color: 'var(--color-primary)', margin: 0 }}>{a.name}</h3>
                          <span style={{
                            padding: '2px 8px', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.05em',
                            background: a.isActive ? 'rgba(44,66,51,0.08)' : 'rgba(192,57,43,0.08)',
                            color: a.isActive ? '#2C4233' : '#c0392b', fontWeight: 600,
                          }}>{a.isActive ? 'Active' : 'Inactive'}</span>
                        </div>
                        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--color-gray)', margin: '0 0 0.5rem' }}>
                          /{a.slug} · {TYPE_OPTIONS.find((t) => t.value === a.type)?.label ?? a.type} · Up to {a.maxGuests} guests{a.sqft ? ` · ${a.sqft} sq ft` : ''}
                        </p>
                        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--color-gray)', lineHeight: 1.5, margin: 0 }}>
                          {a.description.length > 140 ? a.description.slice(0, 140) + '…' : a.description}
                        </p>
                        {tags.length > 0 && (
                          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                            {tags.slice(0, 6).map((tag, i) => (
                              <span key={i} style={{ padding: '1px 6px', fontSize: '0.65rem', border: '1px solid rgba(44,66,51,0.15)', color: 'var(--color-secondary)' }}>{tag}</span>
                            ))}
                            {tags.length > 6 && <span style={{ fontSize: '0.65rem', color: 'var(--color-gray)' }}>+{tags.length - 6}</span>}
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                        <div style={{ textAlign: 'right' }}>
                          <p style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', color: 'var(--color-primary)', margin: 0 }}>${(a.pricePerNight / 100).toLocaleString('en-US')}</p>
                          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', color: 'var(--color-gray)', margin: 0 }}>/ night</p>
                        </div>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button className="action-btn edit" title="Edit" onClick={() => { startEditAcc(a); }}>
                            <Edit2 size={14} />
                          </button>
                          <button className="action-btn" title={a.isActive ? 'Deactivate' : 'Activate'}
                            onClick={() => api.put(`/accommodations/${a.id}`, { isActive: !a.isActive }).then(fetchAccommodations)}>
                            {a.isActive ? <EyeOff size={14} /> : <Eye size={14} />}
                          </button>
                          {!a.isActive && (
                            <button className="action-btn delete" title="Permanently deactivate" onClick={() => handleDeleteAcc(a.id)}>
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* ═══════════ BOOKINGS ═══════════ */}
        {activeTab === 'bookings' && (
          <>
            {/* Filters */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ display: 'flex', gap: '6px' }}>
                {['all', 'pending', 'confirmed', 'cancelled', 'refunded'].map((f) => (
                  <button key={f} onClick={() => setBookingFilter(f)}
                    style={{
                      padding: '6px 14px', border: '1px solid rgba(0,0,0,0.12)',
                      background: bookingFilter === f ? 'var(--color-secondary)' : 'transparent',
                      color: bookingFilter === f ? '#fff' : 'var(--color-primary)',
                      fontFamily: 'var(--font-body)', fontSize: '0.72rem', letterSpacing: '0.05em',
                      textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.15s',
                    }}>{f === 'all' ? `All (${bookings.length})` : f}</button>
                ))}
              </div>
              <div style={{ position: 'relative' }}>
                <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-gray)' }} />
                <input placeholder="Search guest or stay…" value={bookingSearch} onChange={(e) => setBookingSearch(e.target.value)}
                  style={{ ...inputStyle, width: 220, paddingLeft: 32, fontSize: '0.8rem', padding: '8px 12px 8px 32px' }} />
              </div>
            </div>

            {bookingsLoading ? <p style={{ opacity: 0.5 }}>Loading…</p> : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {filteredBookings.length === 0 && <p style={{ opacity: 0.5, padding: '2rem 0', textAlign: 'center' }}>No bookings match your filter.</p>}
                {filteredBookings.map((b) => (
                  <div key={b.id} style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.06)' }}>
                    {/* Summary Row */}
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr 120px', alignItems: 'center', padding: '1rem 1.5rem', cursor: 'pointer' }}
                      onClick={() => setExpandedBookingId(expandedBookingId === b.id ? null : b.id)}>
                      <div>
                        <strong style={{ fontFamily: 'var(--font-heading)', fontWeight: 400, fontSize: '1.05rem' }}>{b.guestFirstName} {b.guestLastName}</strong>
                        <p style={{ fontSize: '0.75rem', color: 'var(--color-gray)', margin: '2px 0 0' }}>{b.guestEmail}</p>
                      </div>
                      <div style={{ fontSize: '0.85rem' }}>
                        <span>{b.accommodation?.name ?? '—'}</span>
                        <p style={{ fontSize: '0.72rem', color: 'var(--color-gray)', margin: '2px 0 0' }}>{fmt(b.checkIn)} → {fmt(b.checkOut)}</p>
                      </div>
                      <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem' }}>{cur(b.totalAmountCents)}</div>
                      <StatusBadge status={b.status} />
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-end' }}>
                        <select value={b.status} onChange={(e) => { e.stopPropagation(); handleStatusChange(b.id, e.target.value); }}
                          onClick={(e) => e.stopPropagation()} className="admin-input"
                          style={{ fontSize: '0.72rem', padding: '4px 6px', width: 'auto' }}>
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="cancelled">Cancelled</option>
                          <option value="refunded">Refunded</option>
                        </select>
                        <ChevronDown size={14} style={{ opacity: 0.3, transform: expandedBookingId === b.id ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                      </div>
                    </div>

                    {/* Expanded Detail */}
                    {expandedBookingId === b.id && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} transition={{ duration: 0.2 }}
                        style={{ borderTop: '1px solid rgba(0,0,0,0.06)', padding: '1.25rem 1.5rem', background: 'rgba(44,66,51,0.02)' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem', fontSize: '0.85rem' }}>
                          <div>
                            <p style={{ ...labelStyle, marginBottom: '4px' }}>Guests</p>
                            <p style={{ margin: 0 }}>{b.guestAdults} adult{b.guestAdults !== 1 ? 's' : ''}{b.guestChildren > 0 ? `, ${b.guestChildren} child${b.guestChildren !== 1 ? 'ren' : ''}` : ''}</p>
                          </div>
                          <div>
                            <p style={{ ...labelStyle, marginBottom: '4px' }}>Duration</p>
                            <p style={{ margin: 0 }}>{b.nights} night{b.nights !== 1 ? 's' : ''}</p>
                          </div>
                          <div>
                            <p style={{ ...labelStyle, marginBottom: '4px' }}>Room Subtotal</p>
                            <p style={{ margin: 0 }}>${b.roomSubtotal?.toLocaleString('en-US') ?? '—'}</p>
                          </div>
                          <div>
                            <p style={{ ...labelStyle, marginBottom: '4px' }}>Add-ons</p>
                            <p style={{ margin: 0 }}>${b.enhancementsSubtotal?.toLocaleString('en-US') ?? '0'}</p>
                          </div>
                          <div>
                            <p style={{ ...labelStyle, marginBottom: '4px' }}>Booked On</p>
                            <p style={{ margin: 0 }}>{fmt(b.createdAt)}</p>
                          </div>
                          <div>
                            <p style={{ ...labelStyle, marginBottom: '4px' }}>Payment</p>
                            <p style={{ margin: 0 }}>{b.paidAt ? `Paid ${fmt(b.paidAt)}` : 'Not paid'}</p>
                          </div>
                        </div>
                        {b.enhancements?.length > 0 && (
                          <div style={{ marginTop: '1rem' }}>
                            <p style={{ ...labelStyle, marginBottom: '4px' }}>Add-on Services</p>
                            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                              {b.enhancements.map((e, i) => (
                                <span key={i} style={{ padding: '3px 10px', fontSize: '0.72rem', border: '1px solid rgba(44,66,51,0.15)', color: 'var(--color-secondary)' }}>
                                  {e.service.name} — ${(e.priceSnapshot / 100).toLocaleString('en-US')}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        {b.specialRequests && (
                          <div style={{ marginTop: '1rem', padding: '0.75rem 1rem', background: 'rgba(44,66,51,0.04)', border: '1px solid rgba(44,66,51,0.08)' }}>
                            <p style={{ ...labelStyle, marginBottom: '4px' }}>Special Requests</p>
                            <p style={{ margin: 0, fontSize: '0.85rem', fontStyle: 'italic', color: 'var(--color-gray)' }}>{b.specialRequests}</p>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ═══════════ SERVICES ═══════════ */}
        {activeTab === 'services' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
              <button className="btn btn-primary btn-sm" onClick={() => setShowAddService(true)} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Plus size={14} /> Add Service
              </button>
            </div>
            {showAddService && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.1)', padding: '1.5rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ margin: 0, fontFamily: 'var(--font-heading)', fontWeight: 400, fontSize: '1.1rem' }}>New Service</h3>
                  <button onClick={() => setShowAddService(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', opacity: 0.5 }}><X size={18} /></button>
                </div>
                <form onSubmit={handleAddService} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                  <div><label style={labelStyle}>Name</label><input style={inputStyle} value={newService.name} onChange={e => setNewService({ ...newService, name: e.target.value })} required /></div>
                  <div><label style={labelStyle}>Category</label><select style={inputStyle} value={newService.category} onChange={e => setNewService({ ...newService, category: e.target.value as Service['category'] })}>
                    <option value="accommodation">Accommodation</option><option value="add-on">Add-on</option><option value="merchandise">Merchandise</option>
                  </select></div>
                  <div><label style={labelStyle}>Price ($)</label><input style={inputStyle} type="number" value={newService.price} onChange={e => setNewService({ ...newService, price: Number(e.target.value) })} required min={0} /></div>
                  <div><label style={labelStyle}>Billing</label><select style={inputStyle} value={newService.priceType} onChange={e => setNewService({ ...newService, priceType: e.target.value as Service['priceType'] })}>
                    <option value="per_night">Per Night</option><option value="one_time">One-time</option>
                  </select></div>
                  <div style={{ gridColumn: '1 / -1' }}><label style={labelStyle}>Description</label><input style={inputStyle} value={newService.description} onChange={e => setNewService({ ...newService, description: e.target.value })} required /></div>
                  <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '8px' }}>
                    <button type="submit" className="btn btn-primary btn-sm">Save</button>
                    <button type="button" className="btn btn-outline btn-sm" onClick={() => setShowAddService(false)}>Cancel</button>
                  </div>
                </form>
              </motion.div>
            )}
            {servicesLoading ? <p style={{ opacity: 0.5 }}>Loading…</p> : (
              <div className="admin-table-container">
                <table className="admin-table">
                  <thead><tr><th>Category</th><th>Name</th><th>Price</th><th>Billing</th><th>Actions</th></tr></thead>
                  <tbody>
                    {services.map((s) => (
                      <tr key={s.id}>
                        <td><span className={`badge badge-${s.category}`}>{getIcon(s.category)} {s.category}</span></td>
                        <td className="cell-name">
                          {editingServiceId === s.id ? <input style={inputStyle} value={editServiceForm.name ?? ''} onChange={e => setEditServiceForm({ ...editServiceForm, name: e.target.value })} />
                            : <div><strong>{s.name}</strong><p className="cell-desc">{s.description}</p></div>}
                        </td>
                        <td className="cell-price">
                          {editingServiceId === s.id ? <input type="number" style={{ ...inputStyle, width: 100 }} value={editServiceForm.price ?? 0} onChange={e => setEditServiceForm({ ...editServiceForm, price: Number(e.target.value) })} min={0} />
                            : `$${(s.price / 100).toFixed(2)}`}
                        </td>
                        <td className="cell-billing">{s.priceType === 'per_night' ? '/ night' : 'one-time'}</td>
                        <td className="cell-actions">
                          {editingServiceId === s.id ? (
                            <button className="btn btn-primary btn-sm" onClick={handleSaveService} disabled={savingServiceId === s.id}>
                              {savingServiceId === s.id ? 'Saving…' : 'Save'}
                            </button>
                          ) : (
                            <>
                              <button className="action-btn edit" onClick={() => { setEditingServiceId(s.id); setEditServiceForm({ ...s }); }}><Edit2 size={14} /></button>
                              <button className="action-btn delete" onClick={() => { if (confirm('Delete?')) api.delete(`/services/${s.id}`).then(fetchServices); }}><Trash2 size={14} /></button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {/* ═══════════ REVIEWS ═══════════ */}
        {activeTab === 'reviews' && (
          <>
            {reviewsLoading ? <p style={{ opacity: 0.5 }}>Loading…</p> : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {reviews.length === 0 && <p style={{ opacity: 0.5, textAlign: 'center', padding: '2rem 0' }}>No reviews yet.</p>}
                {reviews.map((r) => (
                  <div key={r.id} style={{
                    display: 'grid', gridTemplateColumns: '1fr auto',
                    background: '#fff', border: '1px solid rgba(0,0,0,0.06)', padding: '1.25rem 1.5rem',
                    borderLeft: r.isPublished ? '3px solid #27ae60' : '3px solid rgba(0,0,0,0.1)',
                  }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                        <strong style={{ fontFamily: 'var(--font-heading)', fontWeight: 400, fontSize: '1.05rem' }}>{r.authorName}</strong>
                        <span style={{ fontSize: '1rem', color: '#f39c12' }}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                        <span style={{ fontSize: '0.72rem', color: 'var(--color-gray)' }}>{fmt(r.createdAt)}</span>
                      </div>
                      <p style={{ fontSize: '0.9rem', color: 'var(--color-gray)', lineHeight: 1.6, margin: 0 }}>{r.body}</p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-end' }}>
                      <button onClick={() => api.patch(`/reviews/${r.id}`, { isPublished: !r.isPublished }).then(fetchReviews)}
                        style={{
                          background: 'none', border: '1px solid rgba(0,0,0,0.12)', padding: '5px 12px',
                          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.72rem',
                          color: r.isPublished ? '#27ae60' : 'var(--color-gray)',
                        }}>
                        {r.isPublished ? <><Eye size={13} /> Published</> : <><EyeOff size={13} /> Hidden</>}
                      </button>
                      <button className="action-btn delete" onClick={() => { if (confirm('Delete?')) api.delete(`/reviews/${r.id}`).then(fetchReviews); }}>
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ═══════════ CONTACTS ═══════════ */}
        {activeTab === 'contacts' && (
          <>
            {contactsLoading ? <p style={{ opacity: 0.5 }}>Loading…</p> : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {contacts.length === 0 && <p style={{ opacity: 0.5, textAlign: 'center', padding: '2rem 0' }}>No messages yet.</p>}
                {contacts.map((c) => (
                  <div key={c.id} style={{
                    background: '#fff', border: '1px solid rgba(0,0,0,0.06)', padding: '1.25rem 1.5rem',
                    borderLeft: c.isRead ? '3px solid transparent' : '3px solid var(--color-secondary)',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                      onClick={() => setExpandedContactId(expandedContactId === c.id ? null : c.id)}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{
                          width: 36, height: 36, borderRadius: '50%', background: c.isRead ? 'rgba(0,0,0,0.05)' : 'rgba(44,66,51,0.1)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontFamily: 'var(--font-heading)', fontSize: '0.9rem', color: 'var(--color-primary)',
                        }}>{c.name.charAt(0).toUpperCase()}</div>
                        <div>
                          <strong style={{ fontFamily: 'var(--font-heading)', fontWeight: 400, fontSize: '1rem' }}>{c.name}</strong>
                          <p style={{ fontSize: '0.75rem', color: 'var(--color-gray)', margin: '2px 0 0' }}>{c.email}</p>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={{ fontSize: '0.72rem', color: 'var(--color-gray)' }}>{fmt(c.createdAt)}</span>
                        {!c.isRead && (
                          <button onClick={(e) => { e.stopPropagation(); api.patch(`/contact/submissions/${c.id}`, {}).then(fetchContacts); }}
                            style={{ background: 'none', border: '1px solid rgba(0,0,0,0.1)', padding: '3px 10px', fontSize: '0.7rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                            <Check size={11} /> Mark Read
                          </button>
                        )}
                        <ChevronDown size={14} style={{ opacity: 0.3, transform: expandedContactId === c.id ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                      </div>
                    </div>
                    <AnimatePresence>
                      {expandedContactId === c.id && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
                          style={{ overflow: 'hidden' }}>
                          <p style={{ marginTop: '1rem', fontSize: '0.9rem', lineHeight: 1.7, color: 'var(--color-gray)', borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '1rem' }}>
                            {c.message}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
};

export default Admin;
