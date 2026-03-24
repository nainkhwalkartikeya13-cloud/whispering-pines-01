import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Clock, ArrowRight } from 'lucide-react';
import PageHero from '../components/PageHero';
import { blogPosts, BLOG_CATEGORIES } from '../data/blog';

const FADE_UP = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.75, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] } }),
};

const Blog = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const filtered = activeCategory === 'All'
    ? blogPosts
    : blogPosts.filter((p) => p.category === activeCategory);

  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <div>
      <PageHero
        image="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1400"
        subLabel="Field Notes"
        title="Stories from the Gorge"
        description="Trail guides, seasonal insights, and the stories behind our land."
        height="medium"
      />

      <section style={{ padding: 'clamp(3rem, 6vw, 5rem) 2rem', maxWidth: 1200, margin: '0 auto' }}>
        {/* Category Filter */}
        <motion.div variants={FADE_UP} initial="hidden" animate="visible" custom={0}
          style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '3rem', justifyContent: 'center' }}>
          {BLOG_CATEGORIES.map((cat) => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              style={{
                padding: '0.5rem 1.2rem', border: '1px solid rgba(44,66,51,0.2)',
                background: activeCategory === cat ? 'var(--color-secondary)' : 'transparent',
                color: activeCategory === cat ? '#fff' : 'var(--color-primary)',
                fontFamily: 'var(--font-body)', fontSize: '0.8rem', letterSpacing: '0.05em',
                textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.2s',
              }}>
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Featured Post */}
        {featured && (
          <motion.div variants={FADE_UP} initial="hidden" animate="visible" custom={1}>
            <Link to={`/blog/${featured.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0,
                border: '1px solid rgba(44,66,51,0.1)', marginBottom: '3rem', overflow: 'hidden',
              }}>
                <div style={{ overflow: 'hidden', minHeight: 360 }}>
                  <img src={featured.heroImage} alt={featured.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.04)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')} />
                </div>
                <div style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--color-secondary)', marginBottom: '0.75rem' }}>
                    {featured.category}
                  </span>
                  <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 400, fontSize: '1.8rem', lineHeight: 1.2, marginBottom: '1rem', color: 'var(--color-primary)' }}>
                    {featured.title}
                  </h2>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', lineHeight: 1.7, color: 'var(--color-gray)', marginBottom: '1.5rem' }}>
                    {featured.excerpt}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--color-gray)' }}>
                    <span>{featured.author}</span>
                    <span style={{ opacity: 0.3 }}>|</span>
                    <span>{new Date(featured.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    <span style={{ opacity: 0.3 }}>|</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={13} /> {featured.readTime} min read</span>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        )}

        {/* Post Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '2rem' }}>
          {rest.map((post, i) => (
            <motion.div key={post.slug} variants={FADE_UP} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}>
              <Link to={`/blog/${post.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{ border: '1px solid rgba(44,66,51,0.1)', overflow: 'hidden', height: '100%' }}>
                  <div style={{ overflow: 'hidden', height: 220 }}>
                    <img src={post.heroImage} alt={post.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.06)')}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')} />
                  </div>
                  <div style={{ padding: '1.5rem' }}>
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--color-secondary)' }}>
                      {post.category}
                    </span>
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 400, fontSize: '1.3rem', lineHeight: 1.3, margin: '0.5rem 0 0.75rem', color: 'var(--color-primary)' }}>
                      {post.title}
                    </h3>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--color-gray)', marginBottom: '1rem' }}>
                      {post.excerpt}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--color-gray)' }}>
                        {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--color-secondary)' }}>
                        Read <ArrowRight size={14} />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Blog;
