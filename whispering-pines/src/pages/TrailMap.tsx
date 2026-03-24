import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, TrendingUp, Ruler } from 'lucide-react';
import PageHero from '../components/PageHero';
import SectionCTA from '../components/SectionCTA';
import { trails, trailDifficultyColors, type TrailDifficulty } from '../data/trails';

const FADE_UP = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.75, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] } }),
};

const FILTERS: ('all' | TrailDifficulty)[] = ['all', 'easy', 'moderate', 'challenging'];

const TrailMap = () => {
  const [filter, setFilter] = useState<'all' | TrailDifficulty>('all');
  const filtered = filter === 'all' ? trails : trails.filter((t) => t.difficulty === filter);

  return (
    <div>
      <PageHero
        image="https://images.unsplash.com/photo-1551632811-561732d1e306?w=1400"
        subLabel="Explore"
        title="Trails & Hiking"
        description="The Columbia River Gorge offers some of the most spectacular hiking in the Pacific Northwest. All trails are within 30 minutes of our property."
      />

      <section style={{ padding: 'clamp(3rem, 6vw, 5rem) 2rem', maxWidth: 1200, margin: '0 auto' }}>
        {/* Difficulty Filter */}
        <motion.div variants={FADE_UP} initial="hidden" animate="visible" custom={0}
          style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '3rem', justifyContent: 'center' }}>
          {FILTERS.map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              style={{
                padding: '0.5rem 1.2rem', border: '1px solid rgba(44,66,51,0.2)',
                background: filter === f ? 'var(--color-secondary)' : 'transparent',
                color: filter === f ? '#fff' : 'var(--color-primary)',
                fontFamily: 'var(--font-body)', fontSize: '0.8rem', letterSpacing: '0.05em',
                textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.2s',
              }}>
              {f === 'all' ? 'All Trails' : f}
            </button>
          ))}
        </motion.div>

        {/* Trail Cards */}
        <div style={{ display: 'grid', gap: '2rem' }}>
          {filtered.map((trail, i) => (
            <motion.div key={trail.name} variants={FADE_UP} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i % 3}
              style={{
                display: 'grid', gridTemplateColumns: '1fr 2fr',
                border: '1px solid rgba(44,66,51,0.1)', overflow: 'hidden',
              }}>
              <div style={{ overflow: 'hidden', minHeight: 260 }}>
                <img src={trail.image} alt={trail.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')} />
              </div>
              <div style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 400, fontSize: '1.4rem', color: 'var(--color-primary)' }}>
                    {trail.name}
                  </h3>
                  <span style={{
                    padding: '0.2rem 0.6rem', fontSize: '0.65rem', fontFamily: 'var(--font-body)',
                    textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600,
                    color: '#fff', background: trailDifficultyColors[trail.difficulty],
                  }}>
                    {trail.difficulty}
                  </span>
                </div>

                <div style={{
                  display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '1rem',
                  fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--color-gray)',
                }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Ruler size={14} /> {trail.distance}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><TrendingUp size={14} /> {trail.elevation} gain</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={14} /> {trail.estimatedTime}</span>
                </div>

                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', lineHeight: 1.7, color: 'var(--color-gray)', marginBottom: '1rem' }}>
                  {trail.description}
                </p>

                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                  {trail.highlights.map((h) => (
                    <span key={h} style={{
                      display: 'inline-flex', alignItems: 'center', gap: 3,
                      padding: '0.2rem 0.6rem', fontSize: '0.7rem', fontFamily: 'var(--font-body)',
                      border: '1px solid rgba(44,66,51,0.15)', color: 'var(--color-secondary)',
                    }}>
                      <MapPin size={10} /> {h}
                    </span>
                  ))}
                </div>

                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--color-gray)', fontStyle: 'italic' }}>
                  {trail.seasonal}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <SectionCTA heading="Explore the Gorge" description="Book your stay and wake up steps from world-class trails."
        primaryLabel="Check Availability" primaryTo="/book" secondaryLabel="View Accommodations" secondaryTo="/accommodations" />
    </div>
  );
};

export default TrailMap;
