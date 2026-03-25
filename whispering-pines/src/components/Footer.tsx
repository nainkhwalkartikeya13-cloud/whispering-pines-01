import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Youtube, MapPin, Phone, Mail } from 'lucide-react';
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
        <footer className="footer">
            <div className="footer-inner">

                {/* Top branding row */}
                <div className="footer-top">
                    <div>
                        <Link to="/" className="logo-link dark footer-logo">
                            <div className="logo-text">WHISPERING PINES</div>
                            <div className="logo-subtext">RETREATS</div>
                        </Link>
                        <p className="footer-tagline">Columbia River Gorge, Washington</p>
                    </div>
                    <div className="social-links">
                        <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                            <Instagram size={18} />
                        </a>
                        <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                            <Facebook size={18} />
                        </a>
                        <a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                            <Youtube size={18} />
                        </a>
                    </div>
                </div>

                {/* Main grid */}
                <div className="footer-grid">

                    {/* Brand */}
                    <div className="footer-brand">
                        <p className="footer-description">
                            A premium wilderness sanctuary nestled between ancient forests and the Columbia River. Disconnect from the noise. Reconnect with what matters.
                        </p>
                    </div>

                    {/* Stays */}
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

                    {/* Explore */}
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

                    {/* Contact + Newsletter */}
                    <div className="footer-contact">
                        <h4 className="footer-title">Contact</h4>
                        <ul style={{ marginBottom: '0' }}>
                            <li>
                                <MapPin size={15} />
                                <span>1101 Bear Creek Rd<br />Carson, WA 98610</span>
                            </li>
                            <li>
                                <Phone size={15} />
                                <a href="tel:+15094270000" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>
                                    (509) 427-0000
                                </a>
                            </li>
                            <li>
                                <Mail size={15} />
                                <a href="mailto:hello@whisperingpinesretreats.com" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', wordBreak: 'break-all' }}>
                                    hello@whisperingpinesretreats.com
                                </a>
                            </li>
                        </ul>

                        <span className="footer-newsletter-label">Get seasonal guides &amp; exclusive offers</span>
                        <form className="newsletter-form" onSubmit={handleNewsletter}>
                            <input
                                type="email"
                                placeholder="Your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <button type="submit" disabled={nlLoading}>
                                {nlLoading ? '…' : 'Join'}
                            </button>
                        </form>
                        {nlMessage && (
                            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)', marginTop: '0.5rem', fontWeight: 400 }}>
                                {nlMessage}
                            </p>
                        )}
                    </div>

                </div>

                {/* Bottom bar */}
                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} Whispering Pines Retreats. All rights reserved.</p>
                    <div className="legal-links">
                        <Link to="/privacy">Privacy Policy</Link>
                        <Link to="/terms">Terms of Service</Link>
                        <Link to="/cancellation-policy">Cancellation Policy</Link>
                    </div>
                </div>

            </div>
        </footer>
    );
};

export default Footer;
