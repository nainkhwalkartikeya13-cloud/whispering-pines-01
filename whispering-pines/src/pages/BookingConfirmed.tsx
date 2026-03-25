import { useEffect, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function BookingConfirmed() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'succeeded' | 'failed'>('loading');

  useEffect(() => {
    const redirectStatus = searchParams.get('redirect_status');
    const sessionId = searchParams.get('session_id');

    if (redirectStatus === 'succeeded' || sessionId) {
      // Stripe Checkout redirects with session_id on success
      setStatus('succeeded');
      // Auto-redirect to guest portal after 3.5 seconds
      setTimeout(() => {
        navigate('/guest-portal?auto=true');
      }, 3500);
    } else if (redirectStatus === 'failed') {
      setStatus('failed');
    } else {
      // No params means direct navigation (e.g. dev testing)
      setStatus('succeeded');
    }
  }, [searchParams]);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--color-background)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '80px 24px',
    }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          maxWidth: '560px',
          width: '100%',
          textAlign: 'center',
        }}
      >
        {status === 'loading' && (
          <p style={{ color: 'var(--color-primary)', opacity: 0.6 }}>Verifying payment…</p>
        )}

        {status === 'succeeded' && (
          <>
            <div style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: 'var(--color-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 32px',
            }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#F4F4F3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <p style={{ fontFamily: 'var(--font-body)', letterSpacing: '4px', fontSize: '11px', textTransform: 'uppercase', opacity: 0.5, marginBottom: '12px' }}>
              Reservation Confirmed
            </p>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 300, color: 'var(--color-primary)', margin: '0 0 24px' }}>
              Your sanctuary awaits.
            </h1>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', lineHeight: 1.7, opacity: 0.7, marginBottom: '20px' }}>
              A confirmation has been sent to your email with your booking details and check-in instructions. We look forward to welcoming you.
            </p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--color-secondary)', marginBottom: '40px', fontStyle: 'italic' }}>
              Redirecting you to your Guest Portal...
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/" className="btn btn-primary" style={{ display: 'inline-block' }}>
                Return Home
              </Link>
              <Link to="/guest-portal" className="btn btn-outline" style={{ display: 'inline-block' }}>
                Guest Portal
              </Link>
            </div>
          </>
        )}

        {status === 'failed' && (
          <>
            <div style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: '#8B0000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 32px',
            }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#F4F4F3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 300, color: 'var(--color-primary)', margin: '0 0 24px' }}>
              Payment unsuccessful
            </h1>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', lineHeight: 1.7, opacity: 0.7, marginBottom: '40px' }}>
              Your payment could not be processed. No charge was made. Please try again.
            </p>
            <Link to="/book" className="btn btn-primary" style={{ display: 'inline-block' }}>
              Try Again
            </Link>
          </>
        )}
      </motion.div>
    </div>
  );
}
