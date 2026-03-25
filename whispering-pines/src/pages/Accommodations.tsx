import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';

const FADE_UP = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, delay: i * 0.12, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  }),
};

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

const TYPE_LABELS: Record<string, string> = {
  yurt: 'The Creekside Yurt Collection',
  'safari-tent': 'The Woodland Safari Tents',
  'bell-tent': 'The Evergreen Bell Tents',
  campsite: 'The Wilderness Campsites',
};

const TYPE_ORDER = ['yurt', 'safari-tent', 'bell-tent', 'campsite'];

const FALLBACK_IMAGES: Record<string, string> = {
  yurt: 'https://images.unsplash.com/photo-1464207687429-7505649dae38?w=900&q=80',
  'safari-tent': 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=900&q=80',
  'bell-tent': 'https://images.unsplash.com/photo-1478827536114-da961b7f86d2?w=900&q=80',
  campsite: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=900&q=80',
};

const FILTERS = ['All', 'Yurts', 'Safari Tents', 'Bell Tents', 'Campsites'];
const FILTER_TO_TYPE: Record<string, string> = {
  'Yurts': 'yurt',
  'Safari Tents': 'safari-tent',
  'Bell Tents': 'bell-tent',
  'Campsites': 'campsite',
};

const Accommodations = () => {
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    api.get<{ accommodations: Accommodation[] }>('/accommodations')
      .then((data) => setAccommodations(data.accommodations))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = accommodations.filter((a) =>
    activeFilter === 'All' ? true : a.type === FILTER_TO_TYPE[activeFilter]
  );

  const grouped = TYPE_ORDER.reduce<Record<string, Accommodation[]>>((acc, type) => {
    const items = filtered.filter((a) => a.type === type);
    if (items.length) acc[type] = items;
    return acc;
  }, {});

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>

      {/* ── Hero ─────────────────────────────────────────── */}
      <div style={{ position: 'relative', height: '75vh', overflow: 'hidden', display: 'flex', alignItems: 'flex-end' }}>
        <motion.img
          src="https://images.unsplash.com/photo-1464207687429-7505649dae38?w=1800&q=85"
          alt="Glamping in the Columbia Gorge"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '115%', objectFit: 'cover', objectPosition: 'center 30%' }}
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.8, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(27,27,25,0.88) 0%, rgba(27,27,25,0.25) 55%, transparent 100%)' }} />
        <div className="container" style={{ position: 'relative', zIndex: 2, padding: '0 2rem 5rem' }}>
          <motion.p
            variants={FADE_UP} initial="hidden" animate="visible" custom={0}
            style={{ fontFamily: 'var(--font-body)', letterSpacing: '5px', fontSize: '11px', textTransform: 'uppercase', color: 'rgba(244,244,243,0.55)', marginBottom: '14px' }}
          >
            Eight Sanctuaries · 400 Acres
          </motion.p>
          <motion.h1
            variants={FADE_UP} initial="hidden" animate="visible" custom={1}
            style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(3rem, 8vw, 6.5rem)', fontWeight: 300, color: '#F4F4F3', lineHeight: 0.95, textTransform: 'none' }}
          >
            The Stays
          </motion.h1>
          <motion.p
            variants={FADE_UP} initial="hidden" animate="visible" custom={2}
            style={{ fontFamily: 'var(--font-body)', color: 'rgba(244,244,243,0.7)', marginTop: '20px', fontSize: '1rem', maxWidth: '480px', lineHeight: 1.8 }}
          >
            From open-air canvas tents to architect-designed yurts — each sanctuary is crafted for a different kind of dreamer.
          </motion.p>
        </div>
      </div>

      {/* ── Filter Bar ───────────────────────────────────── */}
      <div style={{ background: '#F4F4F3', borderBottom: '1px solid rgba(0,0,0,0.06)', position: 'sticky', top: '70px', zIndex: 10 }}>
        <div className="container" style={{ padding: '0 2rem', display: 'flex', gap: '0', overflowX: 'auto' }}>
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              style={{
                padding: '18px 28px',
                background: 'none',
                border: 'none',
                borderBottom: activeFilter === f ? '2px solid var(--color-secondary)' : '2px solid transparent',
                fontFamily: 'var(--font-body)',
                fontSize: '0.75rem',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                color: activeFilter === f ? 'var(--color-secondary)' : 'var(--color-primary)',
                opacity: activeFilter === f ? 1 : 0.45,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.25s',
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* ── Listings ─────────────────────────────────────── */}
      <div style={{ background: '#F4F4F3', padding: '6rem 2rem' }}>
        <div className="container">
          {loading && (
            <div style={{ textAlign: 'center', padding: '6rem 0', opacity: 0.4, fontFamily: 'var(--font-body)', letterSpacing: '3px', fontSize: '11px', textTransform: 'uppercase' }}>
              Loading sanctuaries…
            </div>
          )}

          {!loading && Object.entries(grouped).map(([type, items]) => (
            <div key={type} style={{ marginBottom: '80px' }}>
              {/* Category Header */}
              <motion.div
                variants={FADE_UP} initial="hidden" whileInView="visible" viewport={{ once: true }}
                style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px' }}
              >
                <span style={{ fontFamily: 'var(--font-body)', letterSpacing: '4px', fontSize: '10px', textTransform: 'uppercase', color: 'var(--color-secondary)' }}>
                  {TYPE_LABELS[type]}
                </span>
                <div style={{ flex: 1, height: '1px', background: 'rgba(44,66,51,0.15)' }} />
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', opacity: 0.35 }}>
                  {items.length} {items.length === 1 ? 'option' : 'options'}
                </span>
              </motion.div>

              {/* Cards */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
                gap: '2px',
              }}>
                {items.map((acc, i) => (
                  <motion.div
                    key={acc.id}
                    variants={FADE_UP} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i * 0.1}
                    style={{ background: '#fff', overflow: 'hidden', cursor: 'pointer' }}
                    whileHover="hover"
                  >
                    <div style={{ overflow: 'hidden', aspectRatio: '4/3', position: 'relative' }}>
                      <motion.img
                        src={acc.images[0] ?? FALLBACK_IMAGES[acc.type]}
                        alt={acc.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                        variants={{ hover: { scale: 1.06 } }}
                        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
                      />
                      <div style={{
                        position: 'absolute',
                        top: '16px',
                        left: '16px',
                        background: 'rgba(244,244,243,0.92)',
                        padding: '4px 12px',
                        fontFamily: 'var(--font-body)',
                        fontSize: '10px',
                        letterSpacing: '2px',
                        textTransform: 'uppercase',
                        color: 'var(--color-secondary)',
                      }}>
                        {TYPE_LABELS[acc.type]}
                      </div>
                    </div>
                    <div style={{ padding: '28px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', color: 'var(--color-primary)', textTransform: 'none', letterSpacing: '0.01em', lineHeight: 1.1 }}>
                          {acc.name}
                        </h3>
                        <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: '12px' }}>
                          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: 'var(--color-secondary)' }}>
                            ${(acc.pricePerNight / 100).toLocaleString('en-US')}
                          </div>
                          <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', letterSpacing: '1px', opacity: 0.45 }}>
                            / night
                          </div>
                        </div>
                      </div>

                      <p style={{ fontFamily: 'var(--font-body)', color: 'var(--color-gray)', fontSize: '0.875rem', lineHeight: 1.75, marginBottom: '20px' }}>
                        {acc.description}
                      </p>

                      {acc.amenityTags.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '24px' }}>
                          {acc.amenityTags.map((tag) => (
                            <span key={tag} style={{
                              fontFamily: 'var(--font-body)',
                              fontSize: '0.7rem',
                              letterSpacing: '1px',
                              textTransform: 'uppercase',
                              color: 'var(--color-secondary)',
                              border: '1px solid rgba(44,66,51,0.2)',
                              padding: '3px 10px',
                            }}>
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        {acc.sqft && (
                          <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', opacity: 0.4, letterSpacing: '1px' }}>
                            {acc.sqft} sq ft · Up to {acc.maxGuests} guests
                          </span>
                        )}
                        <Link to={`/accommodations/${acc.slug}`} className="btn btn-primary" style={{ padding: '10px 24px', fontSize: '0.7rem', marginLeft: 'auto' }}>
                          View Details
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}

          {!loading && filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '6rem 0', opacity: 0.4 }}>
              <p style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem' }}>No results for this filter.</p>
            </div>
          )}
        </div>
      </div>

      {/* ── What's Included ───────────────────────────────── */}
      <div style={{ background: 'var(--color-secondary)', padding: '7rem 2rem' }}>
        <div className="container">
          <motion.h2
            variants={FADE_UP} initial="hidden" whileInView="visible" viewport={{ once: true }}
            style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#F4F4F3', fontWeight: 300, marginBottom: '56px', textTransform: 'none' }}
          >
            Every stay includes.
          </motion.h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px' }}>
            {[
              ['Arrival Provisions', 'Local charcuterie, seasonal fruit, and house-made granola waiting on arrival.'],
              ['Premium Linens', 'Hand-stitched duvets, organic cotton sheets, and Turkish towels.'],
              ['Firewood & Kindling', 'A full cord of seasoned alder, split and stacked at your site.'],
              ['Trail Access', '12 km of groomed trails, topographic maps, and a printed field guide.'],
              ['Concierge Support', '24-hour text support for anything you need — from extra blankets to bear sightings.'],
              ['Private Parking', 'One reserved spot at your sanctuary. EV charging available at select sites.'],
            ].map(([title, desc], i) => (
              <motion.div
                key={title}
                variants={FADE_UP} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i * 0.1}
              >
                <div style={{ width: '32px', height: '1px', background: 'rgba(244,244,243,0.35)', marginBottom: '16px' }} />
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', color: '#F4F4F3', marginBottom: '10px', textTransform: 'none', letterSpacing: '0.02em' }}>
                  {title}
                </h3>
                <p style={{ fontFamily: 'var(--font-body)', color: 'rgba(244,244,243,0.65)', fontSize: '0.875rem', lineHeight: 1.8 }}>
                  {desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA ──────────────────────────────────────────── */}
      <div style={{ background: 'var(--color-primary)', padding: '6rem 2rem', textAlign: 'center' }}>
        <motion.h2
          variants={FADE_UP} initial="hidden" whileInView="visible" viewport={{ once: true }}
          style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: '#F4F4F3', fontWeight: 300, marginBottom: '32px', textTransform: 'none' }}
        >
          Ready to find your sanctuary?
        </motion.h2>
        <motion.div
          variants={FADE_UP} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}
        >
          <Link to="/book" className="btn btn-primary">Check Availability</Link>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Accommodations;
