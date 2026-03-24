import { useState } from 'react';
import { motion } from 'framer-motion';
import { api } from '../lib/api';

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await api.post('/contact', { name, email, message });
      setSubmitSuccess(true);
      setName('');
      setEmail('');
      setMessage('');
    } catch (err) {
      setSubmitError((err as Error).message ?? 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      className="page-section section"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="container" style={{ paddingTop: '100px', minHeight: '80vh' }}>
        <h1 className="section-title" style={{ textAlign: 'center', marginBottom: '3rem' }}>Contact</h1>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem' }}>
          <div>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', marginBottom: '1.5rem', color: 'var(--color-primary)' }}>Get in Touch</h3>
            <p style={{ color: 'var(--color-slate)', marginBottom: '2rem' }}>We're here to help you plan your perfect escape to the Columbia Gorge.</p>

            {submitSuccess ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  padding: '2rem',
                  border: '1px solid var(--color-secondary)',
                  backgroundColor: 'rgba(44,66,51,0.06)',
                }}
              >
                <p style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: 'var(--color-secondary)', marginBottom: '0.5rem' }}>
                  Message sent.
                </p>
                <p style={{ color: 'var(--color-slate)' }}>
                  Thank you for reaching out. We'll be in touch within 24 hours.
                </p>
                <button
                  className="btn btn-outline"
                  style={{ marginTop: '1.5rem' }}
                  onClick={() => setSubmitSuccess(false)}
                >
                  Send Another
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <input
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  style={{ padding: '1rem', border: '1px solid rgba(27,48,34,0.2)', backgroundColor: 'transparent', width: '100%' }}
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{ padding: '1rem', border: '1px solid rgba(27,48,34,0.2)', backgroundColor: 'transparent', width: '100%' }}
                />
                <textarea
                  placeholder="Message"
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  minLength={10}
                  style={{ padding: '1rem', border: '1px solid rgba(27,48,34,0.2)', backgroundColor: 'transparent', width: '100%', resize: 'vertical' }}
                />
                {submitError && (
                  <p style={{ color: '#c0392b', fontSize: '0.9rem', margin: 0 }}>{submitError}</p>
                )}
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ alignSelf: 'flex-start' }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending…' : 'Send Message'}
                </button>
              </form>
            )}
          </div>

          <div style={{ position: 'relative', width: '100%', minHeight: '400px', backgroundColor: '#e5e3df', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, backgroundColor: '#2a2a2a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: '#888' }}>
              <p style={{ fontFamily: 'var(--font-heading)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1rem' }}>Stevenson, WA</p>
              <p style={{ fontSize: '0.8rem' }}>Columbia River Gorge</p>
              <div style={{ width: '20px', height: '20px', backgroundColor: 'var(--color-accent)', borderRadius: '50%', marginTop: '2rem', border: '4px solid #F9F7F2', boxShadow: '0 0 20px rgba(0,0,0,0.5)' }} />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Contact;
