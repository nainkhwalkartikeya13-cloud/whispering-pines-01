import { motion } from 'framer-motion';
import { termsOfService } from '../data/legal';

const FADE_UP = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] } },
};

const Terms = () => (
  <div style={{ paddingTop: '120px', paddingBottom: '5rem' }}>
    <motion.article variants={FADE_UP} initial="hidden" animate="visible"
      style={{ maxWidth: 720, margin: '0 auto', padding: '0 2rem' }}>
      {termsOfService.map((block, i) => {
        if (block.startsWith('## ')) {
          return (
            <h1 key={i} style={{
              fontFamily: 'var(--font-heading)', fontWeight: 300,
              fontSize: 'clamp(2rem, 4vw, 2.8rem)', color: 'var(--color-primary)',
              marginBottom: '0.5rem',
            }}>
              {block.replace('## ', '')}
            </h1>
          );
        }
        if (block.startsWith('### ')) {
          return (
            <h2 key={i} style={{
              fontFamily: 'var(--font-heading)', fontWeight: 400, fontSize: '1.4rem',
              color: 'var(--color-primary)', marginTop: '2.5rem', marginBottom: '0.75rem',
            }}>
              {block.replace('### ', '')}
            </h2>
          );
        }
        if (block.startsWith('Last updated')) {
          return (
            <p key={i} style={{
              fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--color-gray)',
              marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid rgba(44,66,51,0.1)',
            }}>
              {block}
            </p>
          );
        }
        return (
          <p key={i} style={{
            fontFamily: 'var(--font-body)', fontSize: '1rem', lineHeight: 1.8,
            color: 'var(--color-gray)', marginBottom: '1.25rem',
          }}>
            {block}
          </p>
        );
      })}
    </motion.article>
  </div>
);

export default Terms;
