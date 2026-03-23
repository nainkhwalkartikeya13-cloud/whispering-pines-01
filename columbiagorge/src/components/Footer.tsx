import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, MapPin, Phone, Mail } from 'lucide-react';
import { api } from '../lib/api';
import './Footer.css';

const Footer = () => {
    const [email, setEmail] = useState('');
    const [nlMessage, setNlMessage] = useState<string | null>(null);
    const [nlLoading, setNlLoading] = useState(false);

    const handleNewsletter = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;
        setNlLoading(true);
        setNlMessage(null);
        try {
            const res = await api.post<{ message: string }>('/newsletter', { email });
            setNlMessage(res.message);
            setEmail('');
        } catch (err) {
            setNlMessage((err as Error).message ?? 'Something went wrong.');
        } finally {
            setNlLoading(false);
        }
    };

    return (
        <footer className="footer section">
            <div className="container footer-grid">
                <div className="footer-brand">
                    <Link to="/" className="logo-link dark footer-logo">
                        <div className="logo-text">WHISPERING PINES</div>
                        <div className="logo-subtext">RETREATS</div>
                    </Link>
                    <p className="footer-description">
                        A premium sanctuary nestled in the heart of the Pacific Northwest. Disconnect to reconnect.
                    </p>
                    <div className="social-links">
                        <a href="#" aria-label="Instagram"><Instagram size={20} /></a>
                        <a href="#" aria-label="Facebook"><Facebook size={20} /></a>
                    </div>
                </div>

                <div className="footer-links">
                    <h4 className="footer-title">Stays</h4>
                    <nav>
                        <ul>
                            <li><Link to="/stay-with-us">All Accommodations</Link></li>
                            <li><Link to="/luxury-yurts">Luxury Yurts</Link></li>
                            <li><Link to="/safari-tents">Safari Tents</Link></li>
                            <li><Link to="/bell-tents">Bell Tents</Link></li>
                            <li><Link to="/campsites">Campsites</Link></li>
                        </ul>
                    </nav>
                </div>

                <div className="footer-links">
                    <h4 className="footer-title">Explore</h4>
                    <nav>
                        <ul>
                            <li><Link to="/experiences">Experiences</Link></li>
                            <li><Link to="/dining">Dining</Link></li>
                            <li><Link to="/map">Trail Map</Link></li>
                            <li><Link to="/gallery">Gallery</Link></li>
                            <li><Link to="/blog">Blog</Link></li>
                            <li><Link to="/reviews">Reviews</Link></li>
                            <li><Link to="/faqs">FAQs</Link></li>
                        </ul>
                    </nav>
                </div>

                <div className="footer-links">
                    <h4 className="footer-title">Info</h4>
                    <nav>
                        <ul>
                            <li><Link to="/our-story">Our Story</Link></li>
                            <li><Link to="/gather-together">Gather Together</Link></li>
                            <li><Link to="/contact">Contact</Link></li>
                            <li><Link to="/book">Book Now</Link></li>
                            <li><Link to="/guest-portal">Guest Portal</Link></li>
                        </ul>
                    </nav>
                </div>

                <div className="footer-contact">
                    <h4 className="footer-title">Stay Connected</h4>
                    <ul style={{ marginBottom: '1.5rem' }}>
                        <li><MapPin size={16} /> <span>123 Sanctuary Way, Carson, WA 98610</span></li>
                        <li><Phone size={16} /> <span>(555) 123-4567</span></li>
                        <li><Mail size={16} /> <span>hello@columbiagorgegetaways.com</span></li>
                    </ul>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--color-slate)', marginBottom: '0.75rem' }}>
                        Get seasonal guides & exclusive offers
                    </p>
                    <form className="newsletter-form" onSubmit={handleNewsletter}>
                        <input
                            type="email"
                            placeholder="Your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <button type="submit" disabled={nlLoading}>
                            {nlLoading ? '...' : 'Subscribe'}
                        </button>
                    </form>
                    {nlMessage && (
                        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', marginTop: '0.5rem' }}>
                            {nlMessage}
                        </p>
                    )}
                </div>
            </div>
            <div className="footer-bottom container">
                <p>&copy; {new Date().getFullYear()} Whispering Pines Retreats. All rights reserved.</p>
                <div className="legal-links">
                    <Link to="/privacy">Privacy Policy</Link>
                    <Link to="/terms">Terms of Service</Link>
                    <Link to="/cancellation-policy">Cancellation Policy</Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
