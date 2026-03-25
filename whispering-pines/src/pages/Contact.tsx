import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, ArrowRight, Send } from 'lucide-react';
import { api } from '../lib/api';
import './Contact.css';

const contactDetails = [
  {
    icon: MapPin,
    label: 'Address',
    value: '1101 Bear Creek Rd',
    sub: 'Carson, WA 98610',
    href: 'https://maps.google.com/maps?q=1101+Bear+Creek+Rd,+Carson,+WA+98610',
  },
  {
    icon: Phone,
    label: 'Telephone',
    value: '(509) 427-0000',
    sub: 'Mon – Sun, 8 am – 8 pm PT',
    href: 'tel:+15094270000',
  },
  {
    icon: Mail,
    label: 'Email',
    value: 'hello@whisperingpinesretreats.com',
    sub: 'We reply within 24 hours',
    href: 'mailto:hello@whisperingpinesretreats.com',
  },
  {
    icon: Clock,
    label: 'Check-in / Out',
    value: 'Check-in: 3 PM',
    sub: 'Check-out: 11 AM',
    href: null,
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] },
  }),
};

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await api.post('/contact', { name, email, message: subject ? `[${subject}] ${message}` : message });
      setSubmitSuccess(true);
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch (err) {
      setSubmitError((err as Error).message ?? 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="contact-page"
    >
      {/* Hero */}
      <div className="contact-hero">
        <div className="contact-hero-overlay" />
        <motion.div
          className="contact-hero-content"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          <p className="contact-eyebrow">Columbia River Gorge, WA</p>
          <h1 className="contact-title">Let's Plan Your Escape</h1>
          <p className="contact-subtitle">
            Reach out and our team will craft the perfect wilderness getaway for you.
          </p>
        </motion.div>
      </div>

      {/* Info Cards */}
      <section className="contact-cards-section">
        <div className="contact-cards-grid">
          {contactDetails.map(({ icon: Icon, label, value, sub, href }, i) => (
            <motion.div
              key={label}
              className="contact-card"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              custom={i}
            >
              <div className="contact-card-icon">
                <Icon size={22} strokeWidth={1.5} />
              </div>
              <p className="contact-card-label">{label}</p>
              {href ? (
                <a href={href} className="contact-card-value" target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer">
                  {value}
                </a>
              ) : (
                <p className="contact-card-value">{value}</p>
              )}
              <p className="contact-card-sub">{sub}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Form + Map */}
      <section className="contact-body-section">
        <div className="contact-body-grid">

          {/* Form */}
          <motion.div
            className="contact-form-wrapper"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            custom={0}
          >
            <div className="contact-form-header">
              <h2 className="contact-form-title">Send Us a Message</h2>
              <p className="contact-form-desc">
                Whether you're planning a romantic retreat, a family adventure, or a corporate escape — we're here to help.
              </p>
            </div>

            {submitSuccess ? (
              <motion.div
                className="contact-success"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="contact-success-icon">✓</div>
                <h3>Message Received</h3>
                <p>Thank you for reaching out — we'll be in touch within 24 hours.</p>
                <button className="contact-success-btn" onClick={() => setSubmitSuccess(false)}>
                  Send Another <ArrowRight size={16} />
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="contact-form-row">
                  <div className="contact-field">
                    <label htmlFor="contact-name">Full Name</label>
                    <input
                      id="contact-name"
                      type="text"
                      placeholder="Your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="contact-field">
                    <label htmlFor="contact-email">Email Address</label>
                    <input
                      id="contact-email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="contact-field">
                  <label htmlFor="contact-subject">Subject</label>
                  <select
                    id="contact-subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  >
                    <option value="">Select a topic…</option>
                    <option value="Reservation Enquiry">Reservation Enquiry</option>
                    <option value="Group & Corporate Booking">Group &amp; Corporate Booking</option>
                    <option value="Special Occasion">Special Occasion</option>
                    <option value="Cancellation / Modification">Cancellation / Modification</option>
                    <option value="General Question">General Question</option>
                  </select>
                </div>
                <div className="contact-field">
                  <label htmlFor="contact-message">Message</label>
                  <textarea
                    id="contact-message"
                    placeholder="Tell us what you have in mind…"
                    rows={6}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    minLength={10}
                  />
                </div>
                {submitError && (
                  <p className="contact-error">{submitError}</p>
                )}
                <button
                  type="submit"
                  className="contact-submit-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="contact-btn-inner">Sending…</span>
                  ) : (
                    <span className="contact-btn-inner">Send Message <Send size={16} /></span>
                  )}
                  <span className="contact-btn-shine" />
                </button>
              </form>
            )}
          </motion.div>

          {/* Map */}
          <motion.div
            className="contact-map-wrapper"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            custom={1}
          >
            <div className="contact-map-header">
              <h2 className="contact-form-title">Find Us</h2>
              <p className="contact-form-desc">Nestled in the Columbia River Gorge — one of America's most breathtaking landscapes.</p>
            </div>
            <div className="contact-map-container">
              <iframe
                title="Whispering Pines Retreats Location"
                src="https://maps.google.com/maps?q=1101+Bear+Creek+Rd,+Carson,+WA+98610&t=&z=13&ie=UTF8&iwloc=&output=embed"
                className="contact-map-iframe"
                loading="lazy"
              />
              <a
                href="https://maps.google.com/maps?q=1101+Bear+Creek+Rd,+Carson,+WA+98610"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-directions-btn"
              >
                <MapPin size={16} /> Get Directions <ArrowRight size={16} />
              </a>
            </div>
          </motion.div>

        </div>
      </section>
    </motion.div>
  );
};

export default Contact;
