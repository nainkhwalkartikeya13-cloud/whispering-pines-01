import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Header.css';

interface DropdownItem { name: string; path: string }
interface NavItem { name: string; path: string; dropdown?: DropdownItem[] }

const navLinks: NavItem[] = [
  { name: 'The Experience', path: '/' },
  {
    name: 'The Stays', path: '/stay-with-us',
    dropdown: [
      { name: 'All Accommodations', path: '/stay-with-us' },
      { name: 'Luxury Yurts', path: '/luxury-yurts' },
      { name: 'Safari Tents', path: '/safari-tents' },
      { name: 'Bell Tents', path: '/bell-tents' },
      { name: 'Campsites', path: '/campsites' },
    ],
  },
  {
    name: 'Explore', path: '/experiences',
    dropdown: [
      { name: 'Experiences', path: '/experiences' },
      { name: 'Dining', path: '/dining' },
      { name: 'Trail Map', path: '/map' },
      { name: 'Gallery', path: '/gallery' },
    ],
  },
  { name: 'Our Story', path: '/our-story' },
  {
    name: 'More', path: '/blog',
    dropdown: [
      { name: 'Blog', path: '/blog' },
      { name: 'Reviews', path: '/reviews' },
      { name: 'FAQs', path: '/faqs' },
      { name: 'Gather Together', path: '/gather-together' },
      { name: 'Contact', path: '/contact' },
      { name: 'Guest Portal', path: '/guest-portal' },
    ],
  },
];

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownTimeout = useRef<ReturnType<typeof setTimeout>>(undefined);
  const { scrollY } = useScroll();
  const navigate = useNavigate();
  const location = useLocation();

  const isHome = location.pathname === '/';

  const headerBackground = useTransform(
    scrollY,
    [0, 100],
    [isHome ? 'rgba(244, 244, 243, 0)' : 'rgba(244, 244, 243, 1)', 'rgba(244, 244, 243, 1)']
  );

  const headerColor = useTransform(
    scrollY,
    [0, 100],
    [isHome ? 'var(--color-white)' : 'var(--color-primary)', 'var(--color-primary)']
  );

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDropdownEnter = (name: string) => {
    clearTimeout(dropdownTimeout.current);
    setOpenDropdown(name);
  };

  const handleDropdownLeave = () => {
    dropdownTimeout.current = setTimeout(() => setOpenDropdown(null), 150);
  };

  return (
    <>
      <motion.header
        style={{
          background: headerBackground,
          color: headerColor,
          borderBottom: (isScrolled || !isHome) ? '1px solid var(--color-slate)' : '1px solid transparent'
        }}
        className="header"
      >
        <div className="header-container">
          <Link to="/" className="logo-link">
            <div className="logo-text">WHISPERING PINES</div>
            <div className="logo-subtext">RETREATS</div>
          </Link>

          {/* Desktop Nav */}
          <nav className="desktop-nav">
            {navLinks.map((link) => (
              <div
                key={link.name}
                style={{ position: 'relative' }}
                onMouseEnter={() => link.dropdown && handleDropdownEnter(link.name)}
                onMouseLeave={handleDropdownLeave}
              >
                <Link to={link.path} className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  {link.name}
                  {link.dropdown && <ChevronDown size={12} style={{ opacity: 0.5 }} />}
                </Link>
                {link.dropdown && openDropdown === link.name && (
                  <div style={{
                    position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)',
                    paddingTop: 12, minWidth: 200, zIndex: 60,
                  }}>
                    <div style={{
                      background: '#F4F4F3', border: '1px solid rgba(44,66,51,0.1)',
                      boxShadow: '0 8px 30px rgba(0,0,0,0.08)', padding: '0.5rem 0',
                    }}>
                      {link.dropdown.map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => setOpenDropdown(null)}
                          style={{
                            display: 'block', padding: '0.6rem 1.25rem',
                            fontFamily: 'var(--font-body)', fontSize: '0.8rem',
                            color: 'var(--color-primary)', textDecoration: 'none',
                            letterSpacing: '0.05em', transition: 'background 0.15s',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(44,66,51,0.06)')}
                          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="header-actions">
            <button
              className="mobile-toggle"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={28} />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <motion.div
        className="mobile-menu"
        initial={{ x: '100%' }}
        animate={{ x: isMobileMenuOpen ? 0 : '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      >
        <div className="mobile-menu-header">
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="logo-link dark">
            <div className="logo-text">WHISPERING PINES</div>
            <div className="logo-subtext">RETREATS</div>
          </Link>
          <button className="mobile-close" onClick={() => setIsMobileMenuOpen(false)} aria-label="Close menu">
            <X size={28} />
          </button>
        </div>
        <nav className="mobile-nav" style={{ gap: '0.5rem', overflowY: 'auto' }}>
          {navLinks.map((link) => (
            <div key={link.name}>
              <Link to={link.path} className="mobile-nav-link" style={{ fontSize: '1.6rem' }}
                onClick={() => { if (!link.dropdown) setIsMobileMenuOpen(false); }}>
                {link.name}
              </Link>
              {link.dropdown && (
                <div style={{ paddingLeft: '1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem', marginTop: '0.25rem' }}>
                  {link.dropdown.map((item) => (
                    <Link key={item.path} to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      style={{
                        fontFamily: 'var(--font-body)', fontSize: '0.9rem',
                        color: 'var(--color-gray)', textDecoration: 'none',
                        padding: '0.3rem 0',
                      }}>
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <button
            className="btn btn-primary mobile-btn"
            onClick={() => { navigate('/book'); setIsMobileMenuOpen(false); }}
          >
            BOOK NOW
          </button>
        </nav>
      </motion.div>
    </>
  );
};

export default Header;
