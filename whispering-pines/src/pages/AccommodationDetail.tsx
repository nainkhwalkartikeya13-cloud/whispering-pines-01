import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Maximize, ChevronLeft } from 'lucide-react';
import Lightbox from '../components/Lightbox';
import SectionCTA from '../components/SectionCTA';
import { accommodationTypeDetails } from '../data/accommodationDetails';
import { api } from '../lib/api';

const FADE_UP = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.75, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] } }),
};

const TYPE_LABELS: Record<string, string> = {
  yurt: 'Luxury Yurt', 'safari-tent': 'Safari Tent', 'bell-tent': 'Bell Tent', campsite: 'Forest Campsite',
};

interface Accommodation {
  id: string; slug: string; name: string; type: string; description: string;
  sqft: number | null; maxGuests: number; pricePerNight: number; images: string[]; amenityTags: string[];
}

const AccommodationDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [acc, setAcc] = useState<Accommodation | null>(null);
  const [others, setOthers] = useState<Accommodation[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    setLoading(true);
    api.get<{ accommodation: Accommodation }>(`/accommodations/${slug}`)
      .then((d) => { setAcc(d.accommodation); setLoading(false); })
      .catch(() => { setNotFound(true); setLoading(false); });

    api.get<{ accommodations: Accommodation[] }>('/accommodations')
      .then((d) => setOthers(d.accommodations.filter((a) => a.slug !== slug).slice(0, 3)))
      .catch(console.error);
  }, [slug]);

  if (notFound) return <Navigate to="/accommodations" replace />;
  if (loading || !acc) {
    return (
      <div style={{ paddingTop: 150, textAlign: 'center', minHeight: '60vh', fontFamily: 'var(--font-body)', color: 'var(--color-gray)' }}>
        Loading...
      </div>
    );
  }

  const typeDetail = accommodationTypeDetails[acc.type];
  const allImages = [
    ...acc.images,
    ...(typeDetail?.galleryImages.filter((img) => !acc.images.includes(img)) ?? []),
  ];
  const lightboxImgs = allImages.map((src) => ({ src, alt: acc.name }));

  return (
    <div style={{ paddingTop: '90px' }}>
      {/* Photo Gallery */}
      <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}
        style={{ padding: '0 2rem', maxWidth: 1300, margin: '0 auto 2rem' }}>
        <Link to="/accommodations" style={{
          display: 'inline-flex', alignItems: 'center', gap: 4, marginBottom: '1.5rem',
          fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--color-secondary)', textDecoration: 'none',
        }}>
          <ChevronLeft size={16} /> All Accommodations
        </Link>
        <div style={{
          display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gridTemplateRows: '260px 260px',
          gap: '0.5rem', borderRadius: 0,
        }}>
          {allImages.slice(0, 5).map((src, i) => (
            <div key={i} style={{
              overflow: 'hidden', cursor: 'pointer',
              ...(i === 0 ? { gridRow: '1 / 3' } : {}),
            }}
              onClick={() => { setLightboxIndex(i); setLightboxOpen(true); }}>
              <img src={src} alt={`${acc.name} ${i + 1}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.03)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')} />
            </div>
          ))}
        </div>
      </motion.section>

      <Lightbox images={lightboxImgs} currentIndex={lightboxIndex} isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNext={() => setLightboxIndex((i) => (i + 1) % lightboxImgs.length)}
        onPrev={() => setLightboxIndex((i) => (i - 1 + lightboxImgs.length) % lightboxImgs.length)} />

      {/* Detail Content */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem', display: 'grid', gridTemplateColumns: '1fr 380px', gap: '3rem', alignItems: 'start' }}>
        {/* Left: Description */}
        <div>
          <motion.div variants={FADE_UP} initial="hidden" animate="visible" custom={0}>
            <span style={{
              fontFamily: 'var(--font-body)', fontSize: '0.7rem', textTransform: 'uppercase',
              letterSpacing: '0.2em', color: 'var(--color-secondary)',
            }}>
              {TYPE_LABELS[acc.type] ?? acc.type}
            </span>
            <h1 style={{
              fontFamily: 'var(--font-heading)', fontWeight: 300, fontSize: 'clamp(2rem, 4vw, 2.8rem)',
              color: 'var(--color-primary)', marginTop: '0.25rem', marginBottom: '1.5rem',
            }}>
              {acc.name}
            </h1>
          </motion.div>

          {/* Specs Bar */}
          <motion.div variants={FADE_UP} initial="hidden" animate="visible" custom={1}
            style={{
              display: 'flex', gap: '2rem', padding: '1rem 0', marginBottom: '2rem',
              borderTop: '1px solid rgba(44,66,51,0.1)', borderBottom: '1px solid rgba(44,66,51,0.1)',
              fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--color-gray)',
            }}>
            {acc.sqft && <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Maximize size={16} /> {acc.sqft} sq ft</span>}
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Users size={16} /> Up to {acc.maxGuests} guests</span>
          </motion.div>

          <motion.p variants={FADE_UP} initial="hidden" animate="visible" custom={2}
            style={{ fontFamily: 'var(--font-body)', fontSize: '1.05rem', lineHeight: 1.8, color: 'var(--color-gray)', marginBottom: '2rem' }}>
            {acc.description}
          </motion.p>

          {/* Amenity Tags */}
          {acc.amenityTags.length > 0 && (
            <motion.div variants={FADE_UP} initial="hidden" animate="visible" custom={3}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 400, fontSize: '1.3rem', marginBottom: '1rem', color: 'var(--color-primary)' }}>
                Amenities
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {acc.amenityTags.map((tag) => (
                  <span key={tag} style={{
                    padding: '0.4rem 0.8rem', border: '1px solid rgba(44,66,51,0.15)',
                    fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--color-secondary)',
                  }}>
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          )}

          {/* What to Expect */}
          {typeDetail && (
            <motion.div variants={FADE_UP} initial="hidden" whileInView="visible" viewport={{ once: true }}
              style={{ marginTop: '3rem' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 400, fontSize: '1.3rem', marginBottom: '1rem', color: 'var(--color-primary)' }}>
                What to Expect
              </h3>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {typeDetail.whatToExpect.map((item, i) => (
                  <li key={i} style={{
                    fontFamily: 'var(--font-body)', fontSize: '0.95rem', color: 'var(--color-gray)',
                    padding: '0.5rem 0', borderBottom: '1px solid rgba(44,66,51,0.06)',
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                  }}>
                    <span style={{ color: 'var(--color-secondary)', fontSize: '0.8rem' }}>&#10003;</span>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </div>

        {/* Right: Pricing Card */}
        <motion.div variants={FADE_UP} initial="hidden" animate="visible" custom={1}
          style={{
            border: '1px solid rgba(44,66,51,0.12)', padding: '2rem',
            position: 'sticky', top: 100,
          }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', color: 'var(--color-primary)' }}>
              ${(acc.pricePerNight / 100).toLocaleString('en-US')}
            </span>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--color-gray)' }}> / night</span>
          </div>

          <button
            onClick={() => navigate('/book', { state: { preSelectedRoom: acc.id } })}
            className="btn btn-primary"
            style={{ width: '100%', padding: '1rem', fontSize: '0.9rem', marginBottom: '1rem' }}
          >
            Book This {TYPE_LABELS[acc.type]?.split(' ')[1] ?? 'Stay'}
          </button>

          <button
            onClick={() => navigate('/book')}
            className="btn btn-outline"
            style={{ width: '100%', padding: '1rem', fontSize: '0.9rem' }}
          >
            Check All Availability
          </button>

          <div style={{
            marginTop: '1.5rem', padding: '1rem', background: 'rgba(44,66,51,0.04)',
            fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--color-gray)', lineHeight: 1.6,
          }}>
            <strong style={{ color: 'var(--color-primary)' }}>Check-in:</strong> 3:00 PM<br />
            <strong style={{ color: 'var(--color-primary)' }}>Check-out:</strong> 11:00 AM<br />
            <strong style={{ color: 'var(--color-primary)' }}>Cancellation:</strong> Free up to 14 days before
          </div>
        </motion.div>
      </section>

      {/* Other Stays */}
      {others.length > 0 && (
        <section style={{ padding: 'clamp(3rem, 6vw, 5rem) 2rem', maxWidth: 1200, margin: '0 auto' }}>
          <h2 style={{
            fontFamily: 'var(--font-heading)', fontWeight: 300, fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
            textAlign: 'center', marginBottom: '2.5rem', color: 'var(--color-primary)',
          }}>
            Other Stays You Might Love
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
            {others.map((o) => (
              <Link key={o.id} to={`/accommodations/${o.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{ border: '1px solid rgba(44,66,51,0.1)', overflow: 'hidden' }}>
                  <div style={{ overflow: 'hidden', height: 200 }}>
                    <img src={o.images[0]} alt={o.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')} />
                  </div>
                  <div style={{ padding: '1.25rem' }}>
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--color-secondary)' }}>
                      {TYPE_LABELS[o.type] ?? o.type}
                    </span>
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 400, fontSize: '1.2rem', margin: '0.25rem 0 0.75rem' }}>{o.name}</h3>
                    <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', color: 'var(--color-secondary)' }}>
                      ${(o.pricePerNight / 100).toLocaleString('en-US')}
                    </span>
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--color-gray)' }}> / night</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <SectionCTA heading="Find Your Sanctuary" description="Every stay comes with 400 acres of forest, meadow, and creek to explore."
        primaryLabel="View All Stays" primaryTo="/accommodations" secondaryLabel="Plan Your Visit" secondaryTo="/contact" />
    </div>
  );
};

export default AccommodationDetail;
