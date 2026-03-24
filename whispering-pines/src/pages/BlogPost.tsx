import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Calendar } from 'lucide-react';
import { blogPosts } from '../data/blog';

const FADE_UP = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.75, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] } }),
};

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) return <Navigate to="/blog" replace />;

  const related = blogPosts.filter((p) => p.category === post.category && p.slug !== post.slug).slice(0, 2);

  return (
    <div style={{ paddingTop: '100px' }}>
      {/* Hero Image */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}
        style={{ width: '100%', height: '50vh', minHeight: 300, overflow: 'hidden' }}>
        <img src={post.heroImage} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </motion.div>

      {/* Article */}
      <article style={{ maxWidth: 720, margin: '0 auto', padding: '3rem 2rem 5rem' }}>
        <motion.div variants={FADE_UP} initial="hidden" animate="visible" custom={0}>
          <Link to="/blog" style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--color-secondary)',
            textDecoration: 'none', marginBottom: '2rem',
          }}>
            <ArrowLeft size={16} /> Back to Field Notes
          </Link>
        </motion.div>

        <motion.span variants={FADE_UP} initial="hidden" animate="visible" custom={1}
          style={{
            display: 'inline-block', fontFamily: 'var(--font-body)', fontSize: '0.7rem',
            textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--color-secondary)',
            marginBottom: '0.75rem',
          }}>
          {post.category}
        </motion.span>

        <motion.h1 variants={FADE_UP} initial="hidden" animate="visible" custom={2}
          style={{
            fontFamily: 'var(--font-heading)', fontWeight: 300,
            fontSize: 'clamp(2rem, 4vw, 2.8rem)', lineHeight: 1.15,
            color: 'var(--color-primary)', marginBottom: '1.5rem',
          }}>
          {post.title}
        </motion.h1>

        <motion.div variants={FADE_UP} initial="hidden" animate="visible" custom={3}
          style={{
            display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap',
            fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--color-gray)',
            marginBottom: '3rem', paddingBottom: '2rem', borderBottom: '1px solid rgba(44,66,51,0.1)',
          }}>
          <span>By {post.author}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Calendar size={14} /> {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Clock size={14} /> {post.readTime} min read
          </span>
        </motion.div>

        {/* Body */}
        {post.body.map((paragraph, i) => {
          if (paragraph.startsWith('## ')) {
            return (
              <motion.h2 key={i} variants={FADE_UP} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0}
                style={{
                  fontFamily: 'var(--font-heading)', fontWeight: 400, fontSize: '1.6rem',
                  color: 'var(--color-primary)', marginTop: '2.5rem', marginBottom: '1rem',
                }}>
                {paragraph.replace('## ', '')}
              </motion.h2>
            );
          }
          if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
            return (
              <motion.p key={i} variants={FADE_UP} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0}
                style={{
                  fontFamily: 'var(--font-body)', fontSize: '1rem', fontWeight: 600,
                  lineHeight: 1.9, color: 'var(--color-primary)', marginBottom: '0.5rem',
                }}>
                {paragraph.replace(/\*\*/g, '')}
              </motion.p>
            );
          }
          return (
            <motion.p key={i} variants={FADE_UP} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0}
              style={{
                fontFamily: 'var(--font-body)', fontSize: '1.05rem', lineHeight: 1.9,
                color: 'var(--color-gray)', marginBottom: '1.5rem',
                ...(i === 0 ? { fontSize: '1.15rem', color: 'var(--color-primary)' } : {}),
              }}>
              {paragraph}
            </motion.p>
          );
        })}

        {/* Tags */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid rgba(44,66,51,0.1)' }}>
          {post.tags.map((tag) => (
            <span key={tag} style={{
              padding: '0.3rem 0.8rem', border: '1px solid rgba(44,66,51,0.15)',
              fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--color-gray)',
              textTransform: 'uppercase', letterSpacing: '0.05em',
            }}>
              {tag}
            </span>
          ))}
        </div>

        {/* Related Posts */}
        {related.length > 0 && (
          <div style={{ marginTop: '4rem' }}>
            <h3 style={{
              fontFamily: 'var(--font-heading)', fontWeight: 400, fontSize: '1.4rem',
              color: 'var(--color-primary)', marginBottom: '1.5rem',
            }}>
              Related Stories
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {related.map((r) => (
                <Link key={r.slug} to={`/blog/${r.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div style={{ border: '1px solid rgba(44,66,51,0.1)', overflow: 'hidden' }}>
                    <img src={r.heroImage} alt={r.title} style={{ width: '100%', height: 160, objectFit: 'cover' }} />
                    <div style={{ padding: '1rem' }}>
                      <h4 style={{ fontFamily: 'var(--font-heading)', fontWeight: 400, fontSize: '1.1rem', lineHeight: 1.3, marginBottom: '0.5rem' }}>{r.title}</h4>
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--color-gray)' }}>
                        {new Date(r.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
};

export default BlogPost;
