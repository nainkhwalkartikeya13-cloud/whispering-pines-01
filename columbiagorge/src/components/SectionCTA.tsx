import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface SectionCTAProps {
  heading: string;
  description?: string;
  primaryLabel: string;
  primaryTo: string;
  secondaryLabel?: string;
  secondaryTo?: string;
}

const FADE_UP = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] } },
};

export default function SectionCTA({ heading, description, primaryLabel, primaryTo, secondaryLabel, secondaryTo }: SectionCTAProps) {
  return (
    <motion.section
      variants={FADE_UP}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      style={{
        background: 'var(--color-primary)',
        padding: 'clamp(4rem, 8vw, 7rem) 2rem',
        textAlign: 'center',
      }}
    >
      <h2
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'clamp(2rem, 4vw, 3rem)',
          fontWeight: 300,
          color: '#fff',
          marginBottom: '1rem',
        }}
      >
        {heading}
      </h2>
      {description && (
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '1.05rem',
            color: 'rgba(255,255,255,0.7)',
            maxWidth: '600px',
            margin: '0 auto 2.5rem',
            lineHeight: 1.7,
          }}
        >
          {description}
        </p>
      )}
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link to={primaryTo} className="btn btn-primary" style={{ background: 'var(--color-secondary)', borderColor: 'var(--color-secondary)' }}>
          {primaryLabel}
        </Link>
        {secondaryLabel && secondaryTo && (
          <Link to={secondaryTo} className="btn btn-outline" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.4)' }}>
            {secondaryLabel}
          </Link>
        )}
      </div>
    </motion.section>
  );
}
