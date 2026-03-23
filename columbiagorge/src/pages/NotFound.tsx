import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const FADE_UP = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.75, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] } }),
};

const NotFound = () => (
  <div style={{
    minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
    position: 'relative', overflow: 'hidden',
  }}>
    <img
      src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1400"
      alt="Forest"
      style={{
        position: 'absolute', inset: 0, width: '100%', height: '100%',
        objectFit: 'cover', filter: 'brightness(0.35)',
      }}
    />
    <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '2rem' }}>
      <motion.p variants={FADE_UP} initial="hidden" animate="visible" custom={0}
        style={{
          fontFamily: 'var(--font-body)', fontSize: '0.75rem', letterSpacing: '0.3em',
          textTransform: 'uppercase', color: 'rgba(244,244,243,0.5)', marginBottom: '1rem',
        }}>
        Error 404
      </motion.p>
      <motion.h1 variants={FADE_UP} initial="hidden" animate="visible" custom={1}
        style={{
          fontFamily: 'var(--font-heading)', fontWeight: 300,
          fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', color: '#F4F4F3',
          lineHeight: 1.1, marginBottom: '1.5rem',
        }}>
        The trail ends here.
      </motion.h1>
      <motion.p variants={FADE_UP} initial="hidden" animate="visible" custom={2}
        style={{
          fontFamily: 'var(--font-body)', fontSize: '1.05rem', color: 'rgba(244,244,243,0.7)',
          maxWidth: 460, margin: '0 auto 2.5rem', lineHeight: 1.7,
        }}>
        The page you're looking for doesn't exist or has been moved. Let's get you back on the path.
      </motion.p>
      <motion.div variants={FADE_UP} initial="hidden" animate="visible" custom={3}
        style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link to="/" className="btn btn-primary">Return Home</Link>
        <Link to="/stay-with-us" className="btn btn-outline" style={{ borderColor: 'rgba(244,244,243,0.4)', color: '#F4F4F3' }}>
          View Accommodations
        </Link>
      </motion.div>
    </div>
  </div>
);

export default NotFound;
