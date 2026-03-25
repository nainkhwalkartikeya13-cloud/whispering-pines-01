import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Users, Maximize } from 'lucide-react';
import PageHero from '../components/PageHero';
import SectionCTA from '../components/SectionCTA';
import Lightbox from '../components/Lightbox';
import { accommodationTypeDetails } from '../data/accommodationDetails';
import { api } from '../lib/api';

const FADE_UP = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.75, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  }),
};

interface Accommodation {
  id: string; slug: string; name: string; type: string; description: string;
  sqft: number | null; maxGuests: number; pricePerNight: number; images: string[]; amenityTags: string[];
}

const detail = accommodationTypeDetails['yurt'];

const Yurts = () => {
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    api.get<{ accommodations: Accommodation[] }>('/accommodations')
      .then((d) => setAccommodations(d.accommodations.filter((a) => a.type === 'yurt')))
      .catch(console.error);
  }, []);

  const galleryImgs = detail.galleryImages.map((src, i) => ({ src, alt: `Yurt interior ${i + 1}` }));

  return (
    <div>
      <PageHero image={detail.heroImage} subLabel="Our Sanctuaries" title="The Creekside Yurt Collection" description={detail.tagline} />

      {/* The Experience */}
      <section style={{ padding: 'clamp(4rem, 8vw, 7rem) 2rem', maxWidth: 900, margin: '0 auto' }}>
        {detail.longDescription.map((p, i) => (
          <motion.p key={i} variants={FADE_UP} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}
            style={{ fontFamily: 'var(--font-body)', fontSize: '1.05rem', lineHeight: 1.8, color: 'var(--color-gray)', marginBottom: '1.5rem' }}>
            {p}
          </motion.p>
        ))}
      </section>

      {/* Photo Gallery */}
      <section style={{ padding: '0 2rem 4rem', maxWidth: 1200, margin: '0 auto' }}>
        <motion.h2 variants={FADE_UP} initial="hidden" whileInView="visible" viewport={{ once: true }}
          style={{ fontFamily: 'var(--font-heading)', fontWeight: 300, fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', textAlign: 'center', marginBottom: '2rem', color: 'var(--color-primary)' }}>
          Gallery
        </motion.h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
          {detail.galleryImages.map((src, i) => (
            <motion.img key={i} src={src} alt={`Yurt ${i + 1}`} variants={FADE_UP} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}
              onClick={() => { setLightboxIndex(i); setLightboxOpen(true); }}
              style={{ width: '100%', height: 260, objectFit: 'cover', cursor: 'pointer', transition: 'transform 0.3s' }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.03)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')} />
          ))}
        </div>
        <Lightbox images={galleryImgs} currentIndex={lightboxIndex} isOpen={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
          onNext={() => setLightboxIndex((i) => (i + 1) % galleryImgs.length)}
          onPrev={() => setLightboxIndex((i) => (i - 1 + galleryImgs.length) % galleryImgs.length)} />
      </section>

      {/* What's Included */}
      <section style={{ background: 'var(--color-slate)', padding: 'clamp(3rem, 6vw, 5rem) 2rem' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <motion.h2 variants={FADE_UP} initial="hidden" whileInView="visible" viewport={{ once: true }}
            style={{ fontFamily: 'var(--font-heading)', fontWeight: 300, fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', textAlign: 'center', marginBottom: '2.5rem', color: 'var(--color-primary)' }}>
            What's Included
          </motion.h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem' }}>
            {detail.amenities.map((a, i) => (
              <motion.div key={i} variants={FADE_UP} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}
                style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontFamily: 'var(--font-body)', fontSize: '0.95rem', color: 'var(--color-primary)' }}>
                <span style={{ fontSize: '1.5rem' }}>{a.icon}</span>
                <span>{a.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Available Yurts */}
      <section style={{ padding: 'clamp(4rem, 8vw, 6rem) 2rem', maxWidth: 1200, margin: '0 auto' }}>
        <motion.h2 variants={FADE_UP} initial="hidden" whileInView="visible" viewport={{ once: true }}
          style={{ fontFamily: 'var(--font-heading)', fontWeight: 300, fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', textAlign: 'center', marginBottom: '3rem', color: 'var(--color-primary)' }}>
          Our Yurt Collection
        </motion.h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '2rem' }}>
          {accommodations.map((acc, i) => (
            <motion.div key={acc.id} variants={FADE_UP} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}
              style={{ border: '1px solid rgba(44,66,51,0.12)', overflow: 'hidden' }}>
              <div style={{ overflow: 'hidden', height: 220 }}>
                <img src={acc.images[0] ?? detail.heroImage} alt={acc.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.06)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')} />
              </div>
              <div style={{ padding: '1.5rem' }}>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 400, fontSize: '1.4rem', marginBottom: '0.5rem' }}>{acc.name}</h3>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--color-gray)', lineHeight: 1.6, marginBottom: '1rem' }}>{acc.description}</p>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--color-gray)' }}>
                  {acc.sqft && <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Maximize size={14} /> {acc.sqft} sq ft</span>}
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Users size={14} /> Up to {acc.maxGuests}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', color: 'var(--color-secondary)' }}>${(acc.pricePerNight / 100).toLocaleString('en-US')}</span>
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--color-gray)' }}> / night</span>
                  </div>
                  <Link to={`/accommodations/${acc.slug}`} className="btn btn-primary" style={{ fontSize: '0.8rem', padding: '0.6rem 1.2rem' }}>View Details</Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <SectionCTA heading="Your Private Sanctuary Awaits" description="Book your stay and discover the perfect balance of wilderness and luxury."
        primaryLabel="Check Availability" primaryTo="/book" secondaryLabel="View All Stays" secondaryTo="/accommodations" />
    </div>
  );
};

export default Yurts;
