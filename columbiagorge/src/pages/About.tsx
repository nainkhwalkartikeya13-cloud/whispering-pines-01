import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';

const FADE_UP = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: i * 0.15, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  }),
};

const values = [
  {
    number: '01',
    title: 'Rooted in Place',
    body: 'Every structure is sited with care — oriented to the light, sheltered by the forest, positioned to let the land speak. We build with it, not on it.',
  },
  {
    number: '02',
    title: 'Radical Slowness',
    body: 'No schedules. No itineraries unless you want one. The Columbia Gorge moves at the pace of seasons, and so do we.',
  },
  {
    number: '03',
    title: 'Carbon Neutral Since Day One',
    body: 'We offset every stay through verified reforestation partnerships in the Pacific Northwest. The trees that shade you help replant what was lost.',
  },
  {
    number: '04',
    title: 'Crafted, Not Manufactured',
    body: 'Our furnishings are sourced from regional artisans. Our linens are hand-dyed. Our fire rings are forged locally. Nothing here is from a catalogue.',
  },
];

const timeline = [
  { year: '2017', event: 'Two friends buy 400 acres of second-growth Douglas fir in Skamania County, Washington.' },
  { year: '2018', event: 'The first yurt is raised by hand. No power tools. Friends drive in from Portland, Seattle, and Bend to help.' },
  { year: '2019', event: 'We open to guests. Twelve bookings in the first month — all word of mouth.' },
  { year: '2021', event: 'Trillium and Lupine safari tents open. The Gorge calls us to think bigger about what "luxury" means.' },
  { year: '2023', event: 'Certified carbon neutral. Named to Condé Nast Traveler\'s Sustainability Honor Roll.' },
  { year: '2026', event: 'Our 400 acres are now home to eight sanctuaries, a forest spa pavilion, and over 12 km of groomed trails.' },
];

const About = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ background: 'var(--color-background)' }}
    >
      {/* ── Hero ─────────────────────────────────────────── */}
      <div
        ref={heroRef}
        style={{
          position: 'relative',
          height: '90vh',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'flex-end',
        }}
      >
        <motion.div
          style={{ y: heroY, position: 'absolute', inset: 0 }}
        >
          <img
            src="https://images.unsplash.com/photo-1448375240586-882707db888b?w=1800&q=85"
            alt="Columbia River Gorge forest"
            style={{ width: '100%', height: '115%', objectFit: 'cover', objectPosition: 'center 40%' }}
          />
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(27,27,25,0.85) 0%, rgba(27,27,25,0.2) 50%, transparent 100%)',
          }} />
        </motion.div>

        <motion.div
          style={{ opacity: heroOpacity, position: 'relative', zIndex: 2, padding: '0 2rem 5rem' }}
          className="container"
        >
          <motion.p
            variants={FADE_UP} initial="hidden" animate="visible" custom={0}
            style={{ fontFamily: 'var(--font-body)', letterSpacing: '5px', fontSize: '11px', textTransform: 'uppercase', color: 'rgba(244,244,243,0.6)', marginBottom: '16px' }}
          >
            Est. 2017 · Stevenson, Washington
          </motion.p>
          <motion.h1
            variants={FADE_UP} initial="hidden" animate="visible" custom={1}
            style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(3.5rem, 8vw, 7rem)', fontWeight: 300, color: '#F4F4F3', lineHeight: 0.95, letterSpacing: '-0.01em', textTransform: 'none' }}
          >
            Our Story
          </motion.h1>
        </motion.div>
      </div>

      {/* ── Opening Statement ─────────────────────────────── */}
      <div style={{ background: '#F4F4F3' }}>
        <div className="container" style={{ maxWidth: '900px', padding: '8rem 2rem' }}>
          <motion.p
            variants={FADE_UP} initial="hidden" whileInView="visible" viewport={{ once: true }}
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(1.6rem, 3vw, 2.4rem)',
              fontWeight: 300,
              lineHeight: 1.5,
              color: 'var(--color-primary)',
              textTransform: 'none',
              letterSpacing: '0.01em',
            }}
          >
            "We didn't set out to build a business. We set out to find a place where people could remember what quiet feels like — and then we wanted to share it."
          </motion.p>
          <motion.p
            variants={FADE_UP} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}
            style={{ marginTop: '24px', fontFamily: 'var(--font-body)', fontSize: '0.9rem', letterSpacing: '2px', textTransform: 'uppercase', opacity: 0.5 }}
          >
            — Marcus & Elena Whitfield, Founders
          </motion.p>
        </div>
      </div>

      {/* ── Founders Photo + Text ────────────────────────── */}
      <div style={{ background: 'var(--color-secondary)' }}>
        <div className="container" style={{ padding: '0 2rem' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '0',
            alignItems: 'stretch',
          }}>
            <motion.div
              variants={FADE_UP} initial="hidden" whileInView="visible" viewport={{ once: true }}
              style={{ overflow: 'hidden', minHeight: '520px' }}
            >
              <img
                src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=900&q=80"
                alt="Forest floor in Columbia Gorge"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </motion.div>
            <motion.div
              variants={FADE_UP} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}
              style={{ padding: 'clamp(3rem, 6vw, 6rem)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
            >
              <p style={{ fontFamily: 'var(--font-body)', letterSpacing: '4px', fontSize: '10px', textTransform: 'uppercase', color: 'rgba(244,244,243,0.45)', marginBottom: '20px' }}>
                The Beginning
              </p>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#F4F4F3', fontWeight: 300, marginBottom: '28px', textTransform: 'none', letterSpacing: '0.01em' }}>
                400 acres of second-growth forest, one borrowed truck, and an idea.
              </h2>
              <p style={{ fontFamily: 'var(--font-body)', color: 'rgba(244,244,243,0.75)', lineHeight: 1.9, marginBottom: '20px', fontSize: '0.95rem' }}>
                Marcus was a landscape architect. Elena ran a textile studio in Portland. On a rainy November weekend in 2016, they camped in Skamania County on a whim — and never quite recovered from what they found there.
              </p>
              <p style={{ fontFamily: 'var(--font-body)', color: 'rgba(244,244,243,0.75)', lineHeight: 1.9, fontSize: '0.95rem' }}>
                Within six months they had pooled everything they had — savings, a small inheritance, and two personal loans — to purchase 400 acres of recovering forest above the Columbia River. The plan was loose. The conviction was absolute.
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── Timeline ─────────────────────────────────────── */}
      <div style={{ background: '#F4F4F3', padding: '8rem 2rem' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <motion.p
            variants={FADE_UP} initial="hidden" whileInView="visible" viewport={{ once: true }}
            style={{ fontFamily: 'var(--font-body)', letterSpacing: '4px', fontSize: '10px', textTransform: 'uppercase', opacity: 0.4, marginBottom: '16px' }}
          >
            Timeline
          </motion.p>
          <motion.h2
            variants={FADE_UP} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}
            style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 4vw, 3.5rem)', color: 'var(--color-primary)', fontWeight: 300, marginBottom: '64px', textTransform: 'none' }}
          >
            How we got here.
          </motion.h2>

          <div style={{ position: 'relative' }}>
            <div style={{
              position: 'absolute',
              left: '72px',
              top: 0,
              bottom: 0,
              width: '1px',
              background: 'rgba(44,66,51,0.15)',
            }} />
            {timeline.map((item, i) => (
              <motion.div
                key={item.year}
                variants={FADE_UP} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i * 0.1}
                style={{ display: 'flex', gap: '40px', marginBottom: '48px', alignItems: 'flex-start' }}
              >
                <div style={{
                  width: '72px',
                  flexShrink: 0,
                  textAlign: 'right',
                  paddingRight: '32px',
                  position: 'relative',
                }}>
                  <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', color: 'var(--color-secondary)', fontWeight: 400 }}>
                    {item.year}
                  </span>
                  <div style={{
                    position: 'absolute',
                    right: '-5px',
                    top: '6px',
                    width: '9px',
                    height: '9px',
                    borderRadius: '50%',
                    background: 'var(--color-secondary)',
                  }} />
                </div>
                <p style={{ fontFamily: 'var(--font-body)', color: 'var(--color-gray)', lineHeight: 1.8, paddingTop: '2px', fontSize: '0.95rem' }}>
                  {item.event}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Values Grid ──────────────────────────────────── */}
      <div style={{ background: '#ECEAE4', padding: '8rem 2rem' }}>
        <div className="container">
          <motion.p
            variants={FADE_UP} initial="hidden" whileInView="visible" viewport={{ once: true }}
            style={{ fontFamily: 'var(--font-body)', letterSpacing: '4px', fontSize: '10px', textTransform: 'uppercase', opacity: 0.4, marginBottom: '16px', textAlign: 'center' }}
          >
            What We Stand For
          </motion.p>
          <motion.h2
            variants={FADE_UP} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}
            style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 4vw, 3.5rem)', color: 'var(--color-primary)', fontWeight: 300, marginBottom: '64px', textAlign: 'center', textTransform: 'none' }}
          >
            Our principles.
          </motion.h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2px',
          }}>
            {values.map((v, i) => (
              <motion.div
                key={v.number}
                variants={FADE_UP} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i * 0.15}
                style={{ background: '#F4F4F3', padding: '3rem 2.5rem' }}
              >
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', letterSpacing: '3px', color: 'var(--color-secondary)', display: 'block', marginBottom: '20px' }}>
                  {v.number}
                </span>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', color: 'var(--color-primary)', marginBottom: '16px', textTransform: 'none', letterSpacing: '0.02em' }}>
                  {v.title}
                </h3>
                <p style={{ fontFamily: 'var(--font-body)', color: 'var(--color-gray)', lineHeight: 1.8, fontSize: '0.9rem' }}>
                  {v.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Land Image Full-Bleed ─────────────────────────── */}
      <div style={{ height: 'clamp(400px, 55vw, 700px)', overflow: 'hidden', position: 'relative' }}>
        <motion.img
          src="https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1800&q=80"
          alt="Aerial view of the Columbia Gorge"
          style={{ width: '100%', height: '120%', objectFit: 'cover', objectPosition: 'center 60%' }}
          initial={{ scale: 1.08 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.6, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(27,27,25,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <motion.p
            variants={FADE_UP} initial="hidden" whileInView="visible" viewport={{ once: true }}
            style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.8rem, 4vw, 3.5rem)', color: '#F4F4F3', textAlign: 'center', fontWeight: 300, letterSpacing: '0.05em', maxWidth: '700px', padding: '0 24px', textTransform: 'none' }}
          >
            400 acres. One promise. Leave it better than you found it.
          </motion.p>
        </div>
      </div>

      {/* ── CTA ──────────────────────────────────────────── */}
      <div style={{ background: 'var(--color-primary)', padding: '7rem 2rem', textAlign: 'center' }}>
        <motion.p
          variants={FADE_UP} initial="hidden" whileInView="visible" viewport={{ once: true }}
          style={{ fontFamily: 'var(--font-body)', letterSpacing: '4px', fontSize: '10px', textTransform: 'uppercase', color: 'rgba(244,244,243,0.4)', marginBottom: '16px' }}
        >
          Come Experience It
        </motion.p>
        <motion.h2
          variants={FADE_UP} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}
          style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 5vw, 4rem)', color: '#F4F4F3', fontWeight: 300, marginBottom: '40px', textTransform: 'none' }}
        >
          The land is waiting for you.
        </motion.h2>
        <motion.div
          variants={FADE_UP} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={2}
          style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}
        >
          <Link to="/stay-with-us" className="btn btn-primary">Explore The Stays</Link>
          <Link to="/contact" className="btn btn-outline">Get In Touch</Link>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default About;
