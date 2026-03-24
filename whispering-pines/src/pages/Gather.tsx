import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const FADE_UP = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, delay: i * 0.12, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  }),
};

const spaces = [
  {
    name: 'The Grove Pavilion',
    capacity: 'Up to 80 guests',
    sqft: '3,200 sq ft',
    description: 'An open-sided timber-frame pavilion set among 200-year-old Douglas firs. String lights, a stone hearth, and a built-in bar. The forest itself becomes your ceiling.',
    uses: ['Corporate Retreats', 'Wedding Ceremonies', 'Private Dinners', 'Wellness Workshops'],
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=900&q=80',
  },
  {
    name: 'The Creekside Longhouse',
    capacity: 'Up to 40 guests',
    sqft: '1,800 sq ft',
    description: 'A cedar-clad longhouse built along the creek edge. Warm and intimate, with floor-to-ceiling windows that open to the sound of moving water.',
    uses: ['Leadership Offsites', 'Rehearsal Dinners', 'Board Meetings', 'Creative Residencies'],
    image: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=900&q=80',
  },
  {
    name: 'The Meadow',
    capacity: 'Up to 200 guests',
    sqft: 'Open air',
    description: 'A half-acre clearing surrounded by old-growth forest, with a natural amphitheater slope and unobstructed mountain views. Bring a tent, a band, or just a bonfire.',
    uses: ['Festivals & Gatherings', 'Outdoor Weddings', 'Film Screenings', 'Community Events'],
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=900&q=80',
  },
];

const retreatPackages = [
  {
    title: 'The Leadership Retreat',
    duration: '2–4 nights',
    capacity: '8–20 people',
    description: 'Designed for senior teams who need to think bigger. Includes exclusive-use lodging, facilitated sessions in The Creekside Longhouse, catered meals, and guided morning hikes.',
    price: 'From $8,500 / group',
  },
  {
    title: 'The Wellness Immersion',
    duration: '3–5 nights',
    capacity: '6–16 people',
    description: 'A curated program of forest bathing, breathwork, and restorative yoga. Partnered with leading Pacific Northwest wellness practitioners.',
    price: 'From $6,200 / group',
  },
  {
    title: 'The Celebration',
    duration: '1–3 nights',
    capacity: 'Up to 80 guests',
    description: 'Weddings, milestone birthdays, family reunions. Full buyout of the property with private chef, custom florals, and our dedicated events team.',
    price: 'From $12,000 / event',
  },
];

const Gather = () => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>

      {/* ── Hero ─────────────────────────────────────────── */}
      <div style={{ position: 'relative', height: '80vh', overflow: 'hidden', display: 'flex', alignItems: 'flex-end' }}>
        <motion.img
          src="https://images.unsplash.com/photo-1529543544282-ea669407fca3?w=1800&q=85"
          alt="People gathering in nature"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '115%', objectFit: 'cover', objectPosition: 'center 50%' }}
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.8, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(27,27,25,0.9) 0%, rgba(27,27,25,0.3) 55%, transparent 100%)' }} />
        <div className="container" style={{ position: 'relative', zIndex: 2, padding: '0 2rem 5rem' }}>
          <motion.p
            variants={FADE_UP} initial="hidden" animate="visible" custom={0}
            style={{ fontFamily: 'var(--font-body)', letterSpacing: '5px', fontSize: '11px', textTransform: 'uppercase', color: 'rgba(244,244,243,0.55)', marginBottom: '14px' }}
          >
            Retreats · Ceremonies · Celebrations
          </motion.p>
          <motion.h1
            variants={FADE_UP} initial="hidden" animate="visible" custom={1}
            style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(3rem, 8vw, 6.5rem)', fontWeight: 300, color: '#F4F4F3', lineHeight: 0.95, textTransform: 'none' }}
          >
            Gather Together
          </motion.h1>
          <motion.p
            variants={FADE_UP} initial="hidden" animate="visible" custom={2}
            style={{ fontFamily: 'var(--font-body)', color: 'rgba(244,244,243,0.7)', marginTop: '20px', fontSize: '1rem', maxWidth: '520px', lineHeight: 1.8 }}
          >
            The most meaningful conversations happen away from screens, agendas, and overhead lighting. Bring your people here.
          </motion.p>
        </div>
      </div>

      {/* ── Intro ─────────────────────────────────────────── */}
      <div style={{ background: '#F4F4F3', padding: '8rem 2rem' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <motion.p
            variants={FADE_UP} initial="hidden" whileInView="visible" viewport={{ once: true }}
            style={{ fontFamily: 'var(--font-body)', letterSpacing: '4px', fontSize: '10px', textTransform: 'uppercase', color: 'var(--color-secondary)', marginBottom: '20px' }}
          >
            Why Here
          </motion.p>
          <motion.h2
            variants={FADE_UP} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}
            style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.8rem, 4vw, 3rem)', color: 'var(--color-primary)', fontWeight: 300, marginBottom: '32px', textTransform: 'none', lineHeight: 1.3 }}
          >
            There is something about 400 acres of old-growth forest that makes people tell the truth.
          </motion.h2>
          <motion.p
            variants={FADE_UP} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={2}
            style={{ fontFamily: 'var(--font-body)', color: 'var(--color-gray)', lineHeight: 1.9, fontSize: '0.95rem', marginBottom: '20px' }}
          >
            We've hosted Fortune 500 offsites, intimate weddings of 12, yoga teacher trainings, and a bluegrass festival. What all of these had in common: people arrived distracted and left changed.
          </motion.p>
          <motion.p
            variants={FADE_UP} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={3}
            style={{ fontFamily: 'var(--font-body)', color: 'var(--color-gray)', lineHeight: 1.9, fontSize: '0.95rem' }}
          >
            The Columbia Gorge does something to people. It slows them down. It makes the stakes feel different. It makes clarity feel possible. That's the environment we've built everything around.
          </motion.p>
        </div>
      </div>

      {/* ── Event Spaces ────────────────────────────────── */}
      <div style={{ background: '#ECEAE4', padding: '7rem 2rem' }}>
        <div className="container">
          <motion.p
            variants={FADE_UP} initial="hidden" whileInView="visible" viewport={{ once: true }}
            style={{ fontFamily: 'var(--font-body)', letterSpacing: '4px', fontSize: '10px', textTransform: 'uppercase', opacity: 0.4, marginBottom: '16px' }}
          >
            Event Spaces
          </motion.p>
          <motion.h2
            variants={FADE_UP} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}
            style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 4vw, 3.5rem)', color: 'var(--color-primary)', fontWeight: 300, marginBottom: '64px', textTransform: 'none' }}
          >
            Three venues. One forest.
          </motion.h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {spaces.map((space, i) => (
              <motion.div
                key={space.name}
                variants={FADE_UP} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i * 0.15}
                style={{
                  display: 'grid',
                  gridTemplateColumns: i % 2 === 0 ? '1fr 1fr' : '1fr 1fr',
                  background: '#fff',
                  overflow: 'hidden',
                  minHeight: '420px',
                }}
              >
                <div style={{ overflow: 'hidden', order: i % 2 === 1 ? 2 : 1 }}>
                  <motion.img
                    src={space.image}
                    alt={space.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', minHeight: '360px' }}
                    whileHover={{ scale: 1.04 }}
                    transition={{ duration: 0.6 }}
                  />
                </div>
                <div style={{ padding: 'clamp(2rem, 5vw, 4rem)', display: 'flex', flexDirection: 'column', justifyContent: 'center', order: i % 2 === 1 ? 1 : 2 }}>
                  <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--color-secondary)', border: '1px solid rgba(44,66,51,0.2)', padding: '3px 12px' }}>
                      {space.capacity}
                    </span>
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', letterSpacing: '2px', textTransform: 'uppercase', opacity: 0.35, border: '1px solid rgba(0,0,0,0.1)', padding: '3px 12px' }}>
                      {space.sqft}
                    </span>
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', color: 'var(--color-primary)', marginBottom: '16px', textTransform: 'none', letterSpacing: '0.01em' }}>
                    {space.name}
                  </h3>
                  <p style={{ fontFamily: 'var(--font-body)', color: 'var(--color-gray)', lineHeight: 1.8, marginBottom: '28px', fontSize: '0.9rem' }}>
                    {space.description}
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {space.uses.map((use) => (
                      <span key={use} style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', letterSpacing: '1.5px', textTransform: 'uppercase', opacity: 0.5, background: 'var(--color-background)', padding: '4px 12px' }}>
                        {use}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Retreat Packages ─────────────────────────────── */}
      <div style={{ background: 'var(--color-secondary)', padding: '7rem 2rem' }}>
        <div className="container">
          <motion.p
            variants={FADE_UP} initial="hidden" whileInView="visible" viewport={{ once: true }}
            style={{ fontFamily: 'var(--font-body)', letterSpacing: '4px', fontSize: '10px', textTransform: 'uppercase', color: 'rgba(244,244,243,0.4)', marginBottom: '16px' }}
          >
            Curated Experiences
          </motion.p>
          <motion.h2
            variants={FADE_UP} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}
            style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 4vw, 3.5rem)', color: '#F4F4F3', fontWeight: 300, marginBottom: '64px', textTransform: 'none' }}
          >
            Ready-made retreat packages.
          </motion.h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2px' }}>
            {retreatPackages.map((pkg, i) => (
              <motion.div
                key={pkg.title}
                variants={FADE_UP} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i * 0.15}
                style={{ background: 'rgba(255,255,255,0.06)', padding: '2.5rem', border: '1px solid rgba(244,244,243,0.1)' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', gap: '12px', flexWrap: 'wrap' }}>
                  <div>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(244,244,243,0.45)', marginBottom: '6px' }}>
                      {pkg.duration} · {pkg.capacity}
                    </p>
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', color: '#F4F4F3', textTransform: 'none', letterSpacing: '0.01em' }}>
                      {pkg.title}
                    </h3>
                  </div>
                </div>
                <p style={{ fontFamily: 'var(--font-body)', color: 'rgba(244,244,243,0.65)', lineHeight: 1.8, marginBottom: '28px', fontSize: '0.875rem' }}>
                  {pkg.description}
                </p>
                <div style={{ borderTop: '1px solid rgba(244,244,243,0.12)', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', color: 'rgba(244,244,243,0.8)' }}>
                    {pkg.price}
                  </span>
                  <Link to="/contact" style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(244,244,243,0.6)', borderBottom: '1px solid rgba(244,244,243,0.3)', paddingBottom: '2px' }}>
                    Inquire →
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Process ──────────────────────────────────────── */}
      <div style={{ background: '#F4F4F3', padding: '7rem 2rem' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <motion.h2
            variants={FADE_UP} initial="hidden" whileInView="visible" viewport={{ once: true }}
            style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 4vw, 3rem)', color: 'var(--color-primary)', fontWeight: 300, marginBottom: '56px', textTransform: 'none' }}
          >
            How it works.
          </motion.h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px' }}>
            {[
              ['01', 'Reach Out', 'Tell us your vision, group size, and dates via our contact form. Our events team responds within 24 hours.'],
              ['02', 'Site Visit', 'Walk the property with our team. See the spaces, meet the land, understand what\'s possible.'],
              ['03', 'Custom Proposal', 'We build a detailed proposal around your specific needs — lodging, catering, facilitation, activities.'],
              ['04', 'Experience It', 'Arrive. Exhale. Let the forest do the rest.'],
            ].map(([num, title, desc], i) => (
              <motion.div
                key={num}
                variants={FADE_UP} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i * 0.15}
              >
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', letterSpacing: '3px', color: 'var(--color-secondary)', display: 'block', marginBottom: '16px' }}>
                  {num}
                </span>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: 'var(--color-primary)', marginBottom: '12px', textTransform: 'none' }}>
                  {title}
                </h3>
                <p style={{ fontFamily: 'var(--font-body)', color: 'var(--color-gray)', lineHeight: 1.8, fontSize: '0.875rem' }}>
                  {desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Photo Strip ──────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', height: 'clamp(200px, 30vw, 380px)', overflow: 'hidden', gap: '2px' }}>
        {[
          'https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=600&q=80',
          'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&q=80',
          'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=600&q=80',
        ].map((src, i) => (
          <motion.div
            key={i}
            style={{ overflow: 'hidden' }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15, duration: 0.8 }}
          >
            <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          </motion.div>
        ))}
      </div>

      {/* ── CTA ──────────────────────────────────────────── */}
      <div style={{ background: 'var(--color-primary)', padding: '7rem 2rem', textAlign: 'center' }}>
        <motion.p
          variants={FADE_UP} initial="hidden" whileInView="visible" viewport={{ once: true }}
          style={{ fontFamily: 'var(--font-body)', letterSpacing: '4px', fontSize: '10px', textTransform: 'uppercase', color: 'rgba(244,244,243,0.35)', marginBottom: '16px' }}
        >
          Start Planning
        </motion.p>
        <motion.h2
          variants={FADE_UP} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}
          style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 5vw, 4rem)', color: '#F4F4F3', fontWeight: 300, marginBottom: '40px', textTransform: 'none' }}
        >
          Bring your people to the forest.
        </motion.h2>
        <motion.div
          variants={FADE_UP} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={2}
          style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}
        >
          <Link to="/contact" className="btn btn-primary">Inquire About an Event</Link>
          <Link to="/stay-with-us" className="btn btn-outline">Browse The Stays</Link>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Gather;
