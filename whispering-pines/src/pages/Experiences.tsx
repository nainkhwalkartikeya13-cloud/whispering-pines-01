import { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero';
import SectionCTA from '../components/SectionCTA';
import { experiences } from '../data/experiences';

const FADE_UP = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.75, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] } }),
};

const SEASONS = ['All', 'Spring', 'Summer', 'Autumn', 'Winter'];

const SEASON_COLORS: Record<string, string> = {
  Spring: '#6B8E23',
  Summer: '#D4A017',
  Autumn: '#C0662B',
  Winter: '#5B7FA5',
};

const Experiences = () => {
  const [activeSeason, setActiveSeason] = useState('All');

  const filtered = activeSeason === 'All'
    ? experiences
    : experiences.filter((e) => e.season.includes(activeSeason));

  return (
    <div>
      <PageHero
        image="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1400"
        subLabel="Curated Adventures"
        title="Experiences"
        description="From guided hikes to private chef dinners — every experience is designed to deepen your connection with this place."
      />

      <section style={{ padding: 'clamp(3rem, 6vw, 5rem) 2rem', maxWidth: 1200, margin: '0 auto' }}>
        {/* Season Filter */}
        <motion.div variants={FADE_UP} initial="hidden" animate="visible" custom={0}
          style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '3rem', justifyContent: 'center' }}>
          {SEASONS.map((s) => (
            <button key={s} onClick={() => setActiveSeason(s)}
              style={{
                padding: '0.5rem 1.2rem', border: '1px solid rgba(44,66,51,0.2)',
                background: activeSeason === s ? 'var(--color-secondary)' : 'transparent',
                color: activeSeason === s ? '#fff' : 'var(--color-primary)',
                fontFamily: 'var(--font-body)', fontSize: '0.8rem', letterSpacing: '0.05em',
                textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.2s',
              }}>
              {s}
            </button>
          ))}
        </motion.div>

        {/* Experience Cards */}
        <div style={{ display: 'grid', gap: '2rem' }}>
          {filtered.map((exp, i) => (
            <motion.div key={exp.name} variants={FADE_UP} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i % 3}
              style={{
                display: 'grid', gridTemplateColumns: i % 2 === 0 ? '1fr 2fr' : '2fr 1fr',
                border: '1px solid rgba(44,66,51,0.1)', overflow: 'hidden',
              }}>
              <div style={{ overflow: 'hidden', minHeight: 280, order: i % 2 === 0 ? 0 : 1 }}>
                <img src={exp.image} alt={exp.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')} />
              </div>
              <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', order: i % 2 === 0 ? 1 : 0 }}>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 400, fontSize: '1.6rem', color: 'var(--color-primary)', marginBottom: '0.75rem' }}>
                  {exp.name}
                </h3>

                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem', fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--color-gray)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={14} /> {exp.duration}</span>
                  {exp.bookable && exp.price && (
                    <span style={{ fontWeight: 600, color: 'var(--color-secondary)' }}>{exp.price}</span>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                  {exp.season.map((s) => (
                    <span key={s} style={{
                      display: 'inline-flex', alignItems: 'center', gap: 3,
                      padding: '0.2rem 0.6rem', fontSize: '0.7rem', fontFamily: 'var(--font-body)',
                      background: SEASON_COLORS[s] ?? 'var(--color-secondary)',
                      color: '#fff', textTransform: 'uppercase', letterSpacing: '0.05em',
                    }}>
                      <Leaf size={10} /> {s}
                    </span>
                  ))}
                </div>

                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', lineHeight: 1.7, color: 'var(--color-gray)', marginBottom: '1.5rem' }}>
                  {exp.description}
                </p>

                {exp.bookable ? (
                  <Link to="/book" className="btn btn-primary" style={{ alignSelf: 'flex-start', padding: '0.6rem 1.5rem', fontSize: '0.8rem' }}>
                    Book Experience
                  </Link>
                ) : (
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--color-gray)', fontStyle: 'italic' }}>
                    Included with your stay — arrange at check-in
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Seasonal Calendar */}
      <section style={{ padding: 'clamp(3rem, 6vw, 5rem) 2rem', maxWidth: 1000, margin: '0 auto' }}>
        <motion.h2 variants={FADE_UP} initial="hidden" whileInView="visible" viewport={{ once: true }}
          style={{
            fontFamily: 'var(--font-heading)', fontWeight: 300, fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
            textAlign: 'center', marginBottom: '2.5rem', color: 'var(--color-primary)',
          }}>
          Seasonal Availability
        </motion.h2>
        <motion.div variants={FADE_UP} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}
          style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%', borderCollapse: 'collapse',
            fontFamily: 'var(--font-body)', fontSize: '0.85rem',
          }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '0.75rem 1rem', borderBottom: '2px solid rgba(44,66,51,0.15)', color: 'var(--color-primary)' }}>Experience</th>
                {['Spring', 'Summer', 'Autumn', 'Winter'].map((s) => (
                  <th key={s} style={{ textAlign: 'center', padding: '0.75rem 1rem', borderBottom: '2px solid rgba(44,66,51,0.15)', color: 'var(--color-primary)' }}>{s}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {experiences.map((exp) => (
                <tr key={exp.name}>
                  <td style={{ padding: '0.75rem 1rem', borderBottom: '1px solid rgba(44,66,51,0.08)', color: 'var(--color-gray)' }}>{exp.name}</td>
                  {['Spring', 'Summer', 'Autumn', 'Winter'].map((s) => (
                    <td key={s} style={{ textAlign: 'center', padding: '0.75rem 1rem', borderBottom: '1px solid rgba(44,66,51,0.08)' }}>
                      {exp.season.includes(s) ? (
                        <span style={{ color: 'var(--color-secondary)', fontSize: '1.1rem' }}>&#10003;</span>
                      ) : (
                        <span style={{ color: 'rgba(44,66,51,0.15)' }}>—</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </section>

      <SectionCTA heading="Ready for Adventure?" description="Book your stay and unlock a world of curated experiences."
        primaryLabel="Check Availability" primaryTo="/book" secondaryLabel="View Accommodations" secondaryTo="/accommodations" />
    </div>
  );
};

export default Experiences;
