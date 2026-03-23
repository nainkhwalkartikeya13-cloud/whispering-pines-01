import { useState } from 'react';
import { motion } from 'framer-motion';
import { UtensilsCrossed, Wine } from 'lucide-react';
import PageHero from '../components/PageHero';
import SectionCTA from '../components/SectionCTA';
import { diningPhilosophy, chefBio, sampleMenus, wineList } from '../data/dining';

const FADE_UP = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.75, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] } }),
};

const Dining = () => {
  const [activeSeason, setActiveSeason] = useState('Summer');

  const activeMenu = sampleMenus.find((m) => m.season === activeSeason)!;

  return (
    <div>
      <PageHero
        image="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1400"
        subLabel="Farm to Table"
        title="Dining"
        description="Seasonal menus crafted from the land around you."
      />

      {/* Philosophy */}
      <section style={{ padding: 'clamp(3rem, 6vw, 5rem) 2rem', maxWidth: 800, margin: '0 auto' }}>
        {diningPhilosophy.map((p, i) => (
          <motion.p key={i} variants={FADE_UP} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}
            style={{
              fontFamily: 'var(--font-body)', fontSize: i === 0 ? '1.15rem' : '1.05rem',
              lineHeight: 1.9, color: i === 0 ? 'var(--color-primary)' : 'var(--color-gray)',
              marginBottom: '1.5rem',
            }}>
            {p}
          </motion.p>
        ))}
      </section>

      {/* Chef */}
      <section style={{ padding: 'clamp(3rem, 6vw, 5rem) 2rem', maxWidth: 1000, margin: '0 auto' }}>
        <motion.div variants={FADE_UP} initial="hidden" whileInView="visible" viewport={{ once: true }}
          style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '3rem', alignItems: 'center' }}>
          <div style={{ overflow: 'hidden' }}>
            <img src={chefBio.image} alt={chefBio.name}
              style={{ width: '100%', height: 380, objectFit: 'cover' }} />
          </div>
          <div>
            <span style={{
              fontFamily: 'var(--font-body)', fontSize: '0.7rem', textTransform: 'uppercase',
              letterSpacing: '0.2em', color: 'var(--color-secondary)',
            }}>
              {chefBio.title}
            </span>
            <h2 style={{
              fontFamily: 'var(--font-heading)', fontWeight: 300, fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
              color: 'var(--color-primary)', marginTop: '0.25rem', marginBottom: '1.5rem',
            }}>
              {chefBio.name}
            </h2>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', lineHeight: 1.8, color: 'var(--color-gray)' }}>
              {chefBio.bio}
            </p>
          </div>
        </motion.div>
      </section>

      {/* Sample Menus */}
      <section style={{ padding: 'clamp(3rem, 6vw, 5rem) 2rem', background: 'rgba(44,66,51,0.03)' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <motion.h2 variants={FADE_UP} initial="hidden" whileInView="visible" viewport={{ once: true }}
            style={{
              fontFamily: 'var(--font-heading)', fontWeight: 300, fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
              textAlign: 'center', marginBottom: '0.5rem', color: 'var(--color-primary)',
            }}>
            Sample Menus
          </motion.h2>
          <motion.p variants={FADE_UP} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}
            style={{
              fontFamily: 'var(--font-body)', fontSize: '0.95rem', textAlign: 'center',
              color: 'var(--color-gray)', marginBottom: '2.5rem',
            }}>
            Our menus change with the seasons. Here's a taste of what awaits.
          </motion.p>

          {/* Season Tabs */}
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginBottom: '2.5rem' }}>
            {sampleMenus.map((m) => (
              <button key={m.season} onClick={() => setActiveSeason(m.season)}
                style={{
                  padding: '0.5rem 1.2rem', border: '1px solid rgba(44,66,51,0.2)',
                  background: activeSeason === m.season ? 'var(--color-secondary)' : 'transparent',
                  color: activeSeason === m.season ? '#fff' : 'var(--color-primary)',
                  fontFamily: 'var(--font-body)', fontSize: '0.8rem', letterSpacing: '0.05em',
                  textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.2s',
                }}>
                {m.season}
              </button>
            ))}
          </div>

          {/* Menu Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {activeMenu.items.map((item, i) => (
              <motion.div key={item.name} variants={FADE_UP} initial="hidden" animate="visible" custom={i}
                style={{
                  padding: '1.5rem 2rem', border: '1px solid rgba(44,66,51,0.1)',
                  background: '#fff',
                }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <UtensilsCrossed size={14} style={{ color: 'var(--color-secondary)' }} />
                  <span style={{
                    fontFamily: 'var(--font-body)', fontSize: '0.7rem', textTransform: 'uppercase',
                    letterSpacing: '0.15em', color: 'var(--color-secondary)',
                  }}>
                    {item.course}
                  </span>
                </div>
                <h3 style={{
                  fontFamily: 'var(--font-heading)', fontWeight: 400, fontSize: '1.3rem',
                  color: 'var(--color-primary)', marginBottom: '0.5rem',
                }}>
                  {item.name}
                </h3>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', lineHeight: 1.7, color: 'var(--color-gray)' }}>
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Wine List */}
      <section style={{ padding: 'clamp(3rem, 6vw, 5rem) 2rem', maxWidth: 900, margin: '0 auto' }}>
        <motion.div variants={FADE_UP} initial="hidden" whileInView="visible" viewport={{ once: true }}
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', justifyContent: 'center', marginBottom: '2.5rem' }}>
          <Wine size={20} style={{ color: 'var(--color-secondary)' }} />
          <h2 style={{
            fontFamily: 'var(--font-heading)', fontWeight: 300, fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
            color: 'var(--color-primary)',
          }}>
            Wine Selection
          </h2>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '1.5rem' }}>
          {wineList.map((wine, i) => (
            <motion.div key={wine.name} variants={FADE_UP} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}
              style={{ padding: '1.5rem', border: '1px solid rgba(44,66,51,0.1)' }}>
              <span style={{
                fontFamily: 'var(--font-body)', fontSize: '0.65rem', textTransform: 'uppercase',
                letterSpacing: '0.15em', color: 'var(--color-secondary)',
              }}>
                {wine.vineyard} · {wine.varietal}
              </span>
              <h3 style={{
                fontFamily: 'var(--font-heading)', fontWeight: 400, fontSize: '1.2rem',
                color: 'var(--color-primary)', margin: '0.25rem 0 0.5rem',
              }}>
                {wine.name}
              </h3>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', lineHeight: 1.7, color: 'var(--color-gray)' }}>
                {wine.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      <SectionCTA heading="Taste the Gorge" description="Book a private chef dinner or explore our curated experiences."
        primaryLabel="Book an Experience" primaryTo="/experiences" secondaryLabel="View Accommodations" secondaryTo="/accommodations" />
    </div>
  );
};

export default Dining;
