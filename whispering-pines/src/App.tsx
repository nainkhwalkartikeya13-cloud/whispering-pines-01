import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import BookingBar from './components/BookingBar';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import Accommodations from './pages/Accommodations';
import AccommodationDetail from './pages/AccommodationDetail';
import Gather from './pages/Gather';
import About from './pages/About';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import Booking from './pages/Booking';
import BookingConfirmed from './pages/BookingConfirmed';
import Yurts from './pages/Yurts';
import SafariTents from './pages/SafariTents';
import BellTents from './pages/BellTents';
import Campsites from './pages/Campsites';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Faqs from './pages/Faqs';
import TrailMap from './pages/TrailMap';
import Reviews from './pages/Reviews';
import Gallery from './pages/Gallery';
import Experiences from './pages/Experiences';
import Dining from './pages/Dining';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import CancellationPolicy from './pages/CancellationPolicy';
import GuestPortal from './pages/MyBookings';
import NotFound from './pages/NotFound';

function AppContent() {
  const location = useLocation();
  const isBookingPage = location.pathname === '/book' || location.pathname === '/booking-confirmed';

  return (
    <div className="app">
      <ScrollToTop />
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/stay-with-us" element={<Accommodations />} />
          <Route path="/accommodations" element={<Accommodations />} />
          <Route path="/accommodations/:slug" element={<AccommodationDetail />} />
          <Route path="/gather-together" element={<Gather />} />
          <Route path="/our-story" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/book" element={<Booking />} />
          <Route path="/booking-confirmed" element={<BookingConfirmed />} />
          <Route path="/luxury-yurts" element={<Yurts />} />
          <Route path="/safari-tents" element={<SafariTents />} />
          <Route path="/bell-tents" element={<BellTents />} />
          <Route path="/campsites" element={<Campsites />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/faqs" element={<Faqs />} />
          <Route path="/map" element={<TrailMap />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/experiences" element={<Experiences />} />
          <Route path="/dining" element={<Dining />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/cancellation-policy" element={<CancellationPolicy />} />
          <Route path="/guest-portal" element={<GuestPortal />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!isBookingPage && <BookingBar />}
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
