import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PageHero from '../components/PageHero';
import StarRating from '../components/StarRating';
import SectionCTA from '../components/SectionCTA';
import { api } from '../lib/api';

const FADE_UP = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.75, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] } }),
};

interface Review {
  id: string;
  authorName: string;
  body: string;
  rating: number;
  createdAt: string;
}

const Reviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  // Submission form
  const [showForm, setShowForm] = useState(false);
  const [formName, setFormName] = useState('');
  const [formBody, setFormBody] = useState('');
  const [formRating, setFormRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);

  useEffect(() => {
    api.get<{ reviews: Review[] }>('/reviews?limit=30')
      .then((data) => setReviews(data.reviews))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitMessage(null);
    try {
      const res = await api.post<{ message: string }>('/reviews', {
        authorName: formName,
        body: formBody,
        rating: formRating,
      });
      setSubmitMessage(res.message);
      setFormName(''); setFormBody(''); setFormRating(5);
      setShowForm(false);
    } catch (err) {
      setSubmitMessage((err as Error).message ?? 'Failed to submit review.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <PageHero
        image="https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1400"
        subLabel="Guest Stories"
        title="Reviews"
        description="Discover what others are saying about their sanctuary experience."
        height="medium"
      />

      <section style={{ padding: 'clamp(3rem, 6vw, 5rem) 2rem', maxWidth: 1200, margin: '0 auto' }}>
        {/* Stats & Write Review */}
        <motion.div variants={FADE_UP} initial="hidden" animate="visible"
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '3rem' }}>
          <div>
            {avgRating && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontFamily: 'var(--font-heading)', fontSize: '3rem', color: 'var(--color-primary)' }}>{avgRating}</span>
                <div>
                  <StarRating rating={Math.round(parseFloat(avgRating))} size={18} />
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--color-gray)' }}>
                    Based on {reviews.length} review{reviews.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            )}
          </div>
          <button onClick={() => setShowForm(!showForm)} className="btn btn-primary" style={{ padding: '0.75rem 1.5rem' }}>
            {showForm ? 'Cancel' : 'Write a Review'}
          </button>
        </motion.div>

        {/* Success/Error Message */}
        {submitMessage && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{
              padding: '1rem 1.5rem', marginBottom: '2rem',
              background: 'rgba(44,66,51,0.06)', border: '1px solid rgba(44,66,51,0.15)',
              fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--color-secondary)',
            }}>
            {submitMessage}
          </motion.div>
        )}

        {/* Review Submission Form */}
        {showForm && (
          <motion.form
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmit}
            style={{
              padding: '2rem', border: '1px solid rgba(44,66,51,0.12)',
              marginBottom: '3rem', display: 'flex', flexDirection: 'column', gap: '1.25rem',
            }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 400, fontSize: '1.4rem', color: 'var(--color-primary)' }}>
              Share Your Experience
            </h3>

            <div>
              <label style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--color-gray)', display: 'block', marginBottom: '0.5rem' }}>
                Your Rating
              </label>
              <StarRating rating={formRating} size={28} interactive onChange={setFormRating} />
            </div>

            <div>
              <label style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--color-gray)', display: 'block', marginBottom: '0.5rem' }}>
                Your Name
              </label>
              <input
                type="text" required value={formName} onChange={(e) => setFormName(e.target.value)}
                placeholder="e.g. Sarah & James"
                style={{
                  width: '100%', padding: '0.75rem', border: '1px solid rgba(44,66,51,0.2)',
                  fontFamily: 'var(--font-body)', fontSize: '0.95rem', background: 'transparent',
                }}
              />
            </div>

            <div>
              <label style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--color-gray)', display: 'block', marginBottom: '0.5rem' }}>
                Your Review
              </label>
              <textarea
                required value={formBody} onChange={(e) => setFormBody(e.target.value)}
                placeholder="Tell us about your stay..."
                rows={4}
                style={{
                  width: '100%', padding: '0.75rem', border: '1px solid rgba(44,66,51,0.2)',
                  fontFamily: 'var(--font-body)', fontSize: '0.95rem', background: 'transparent', resize: 'vertical',
                }}
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={submitting}
              style={{ alignSelf: 'flex-start', padding: '0.75rem 2rem' }}>
              {submitting ? 'Submitting…' : 'Submit Review'}
            </button>
          </motion.form>
        )}

        {/* Reviews Grid */}
        {loading ? (
          <p style={{ textAlign: 'center', opacity: 0.5, fontFamily: 'var(--font-body)' }}>Loading reviews…</p>
        ) : reviews.length === 0 ? (
          <p style={{ textAlign: 'center', opacity: 0.5, fontFamily: 'var(--font-body)', padding: '3rem 0' }}>No reviews yet. Be the first!</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
            {reviews.map((review, i) => (
              <motion.div key={review.id} variants={FADE_UP} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i % 4}
                style={{ padding: '2rem', border: '1px solid rgba(44,66,51,0.08)', background: '#fff' }}>
                <StarRating rating={review.rating} size={14} />
                <p style={{
                  fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: '0.95rem',
                  lineHeight: 1.7, color: 'var(--color-gray)', margin: '0.75rem 0 1rem',
                }}>
                  "{review.body}"
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)', fontSize: '1rem' }}>
                    — {review.authorName}
                  </span>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--color-gray)' }}>
                    {new Date(review.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      <SectionCTA heading="Experience It Yourself" description="Book your stay and create your own story."
        primaryLabel="Check Availability" primaryTo="/book" secondaryLabel="View Accommodations" secondaryTo="/accommodations" />
    </div>
  );
};

export default Reviews;
