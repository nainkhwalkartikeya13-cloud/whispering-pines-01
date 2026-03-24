import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageHero from '../components/PageHero';
import Lightbox from '../components/Lightbox';
import { galleryImages, GALLERY_CATEGORIES, type GalleryCategory } from '../data/gallery';

const FADE_UP = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.75, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] } }),
};

const Gallery = () => {
  const [activeCategory, setActiveCategory] = useState<GalleryCategory | 'all'>('all');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const filtered = activeCategory === 'all'
    ? galleryImages
    : galleryImages.filter((img) => img.category === activeCategory);

  const lightboxImgs = filtered.map((img) => ({ src: img.src, alt: img.alt }));

  return (
    <div>
      <PageHero
        image="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1400"
        subLabel="Visual Journal"
        title="Gallery"
        description="Moments captured across 400 acres of forest, meadow, and river."
        height="medium"
      />

      <section style={{ padding: 'clamp(3rem, 6vw, 5rem) 2rem', maxWidth: 1300, margin: '0 auto' }}>
        {/* Category Filter */}
        <motion.div variants={FADE_UP} initial="hidden" animate="visible" custom={0}
          style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '3rem', justifyContent: 'center' }}>
          {GALLERY_CATEGORIES.map((cat) => (
            <button key={cat.value} onClick={() => setActiveCategory(cat.value)}
              style={{
                padding: '0.5rem 1.2rem', border: '1px solid rgba(44,66,51,0.2)',
                background: activeCategory === cat.value ? 'var(--color-secondary)' : 'transparent',
                color: activeCategory === cat.value ? '#fff' : 'var(--color-primary)',
                fontFamily: 'var(--font-body)', fontSize: '0.8rem', letterSpacing: '0.05em',
                textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.2s',
              }}>
              {cat.label}
            </button>
          ))}
        </motion.div>

        {/* Masonry Grid */}
        <AnimatePresence mode="popLayout">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '0.5rem',
            }}>
            {filtered.map((img, i) => (
              <motion.div
                key={img.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: i * 0.03 }}
                style={{
                  overflow: 'hidden',
                  cursor: 'pointer',
                  ...(img.span === 2 ? { gridColumn: 'span 2' } : {}),
                }}
                onClick={() => { setLightboxIndex(i); setLightboxOpen(true); }}>
                <img
                  src={img.src}
                  alt={img.alt}
                  style={{
                    width: '100%', height: img.span === 2 ? 400 : 280,
                    objectFit: 'cover', display: 'block',
                    transition: 'transform 0.4s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </section>

      <Lightbox
        images={lightboxImgs}
        currentIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNext={() => setLightboxIndex((i) => (i + 1) % lightboxImgs.length)}
        onPrev={() => setLightboxIndex((i) => (i - 1 + lightboxImgs.length) % lightboxImgs.length)}
      />
    </div>
  );
};

export default Gallery;
