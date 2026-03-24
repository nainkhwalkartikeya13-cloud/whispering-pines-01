import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Search } from 'lucide-react';
import PageHero from '../components/PageHero';
import SectionCTA from '../components/SectionCTA';
import { faqCategories } from '../data/faqs';

const FADE_UP = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.75, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] } }),
};

const Faqs = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [openIndex, setOpenIndex] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCategories = faqCategories
    .filter((cat) => activeCategory === 'All' || cat.title === activeCategory)
    .map((cat) => ({
      ...cat,
      questions: cat.questions.filter(
        (q) =>
          !searchQuery ||
          q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.a.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((cat) => cat.questions.length > 0);

  return (
    <div>
      <PageHero
        image="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1400"
        subLabel="Help Center"
        title="Frequently Asked Questions"
        description="Everything you need to know about your stay at Whispering Pines Retreats."
        height="medium"
      />

      <section style={{ padding: 'clamp(3rem, 6vw, 5rem) 2rem', maxWidth: 900, margin: '0 auto' }}>
        {/* Search */}
        <motion.div variants={FADE_UP} initial="hidden" animate="visible" custom={0}
          style={{ position: 'relative', marginBottom: '2rem' }}>
          <Search size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-gray)' }} />
          <input
            type="text"
            placeholder="Search questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%', padding: '14px 16px 14px 44px', border: '1px solid rgba(44,66,51,0.2)',
              fontFamily: 'var(--font-body)', fontSize: '0.95rem', outline: 'none', background: 'transparent',
            }}
          />
        </motion.div>

        {/* Category Pills */}
        <motion.div variants={FADE_UP} initial="hidden" animate="visible" custom={1}
          style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
          {['All', ...faqCategories.map((c) => c.title)].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: '0.5rem 1.2rem', border: '1px solid rgba(44,66,51,0.2)',
                background: activeCategory === cat ? 'var(--color-secondary)' : 'transparent',
                color: activeCategory === cat ? '#fff' : 'var(--color-primary)',
                fontFamily: 'var(--font-body)', fontSize: '0.8rem', letterSpacing: '0.05em',
                textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.2s',
              }}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* FAQ Sections */}
        {filteredCategories.map((cat, ci) => (
          <motion.div key={cat.title} variants={FADE_UP} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={ci}
            style={{ marginBottom: '3rem' }}>
            <h2 style={{
              fontFamily: 'var(--font-heading)', fontWeight: 400, fontSize: '1.6rem',
              color: 'var(--color-primary)', marginBottom: '1.5rem',
              paddingBottom: '0.75rem', borderBottom: '1px solid rgba(44,66,51,0.1)',
            }}>
              {cat.title}
            </h2>
            {cat.questions.map((item, qi) => {
              const key = `${cat.title}-${qi}`;
              const isOpen = openIndex === key;
              return (
                <div key={qi} style={{ borderBottom: '1px solid rgba(44,66,51,0.08)' }}>
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : key)}
                    style={{
                      width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '1.25rem 0', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
                    }}
                  >
                    <span style={{
                      fontFamily: 'var(--font-body)', fontSize: '1rem', fontWeight: 500,
                      color: 'var(--color-primary)', paddingRight: '1rem',
                    }}>
                      {item.q}
                    </span>
                    <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.25 }}>
                      <ChevronDown size={18} style={{ color: 'var(--color-secondary)', flexShrink: 0 }} />
                    </motion.span>
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        style={{ overflow: 'hidden' }}
                      >
                        <p style={{
                          fontFamily: 'var(--font-body)', fontSize: '0.95rem', lineHeight: 1.8,
                          color: 'var(--color-gray)', paddingBottom: '1.25rem',
                        }}>
                          {item.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </motion.div>
        ))}

        {filteredCategories.length === 0 && (
          <p style={{ textAlign: 'center', fontFamily: 'var(--font-body)', color: 'var(--color-gray)', padding: '3rem 0' }}>
            No questions match your search. Try different keywords or <a href="/contact" style={{ color: 'var(--color-secondary)' }}>contact us directly</a>.
          </p>
        )}
      </section>

      <SectionCTA heading="Still Have Questions?" description="Our team is here to help you plan the perfect stay."
        primaryLabel="Contact Us" primaryTo="/contact" secondaryLabel="View Accommodations" secondaryTo="/accommodations" />
    </div>
  );
};

export default Faqs;
