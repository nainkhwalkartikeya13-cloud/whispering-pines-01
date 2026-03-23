import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Users, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './BookingBar.css';

const BookingBar = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
    const [startDate, endDate] = dateRange;
    const [guests, setGuests] = useState({ adults: 2, children: 0 });
    const [isGuestDropdownOpen, setIsGuestDropdownOpen] = useState(false);
    const navigate = useNavigate();

    const handleBookNow = () => {
        setIsExpanded(false);
        navigate('/book', { state: { dateRange, guests } });
    };

    return (
        <>
            {/* Mobile Floating Widget */}
            <div className="booking-widget-mobile">
                <div className="booking-mobile-content">
                    <div className="booking-price-hint">
                        <span className="price-label">From</span>
                        <span className="price-value">$250</span>
                        <span className="price-night">/night</span>
                    </div>
                    <button
                        className="btn btn-primary"
                        onClick={() => {
                            if (window.innerWidth >= 1024) {
                                handleBookNow();
                            } else {
                                setIsExpanded(true);
                            }
                        }}
                    >
                        BOOK NOW
                    </button>
                </div>
            </div>

            {/* Desktop Booking Bar / Expanded Mobile Booking */}
            <AnimatePresence>
                {(isExpanded || window.innerWidth >= 1024) && (
                    <motion.div
                        className={`booking-bar-container ${isExpanded ? 'mobile-expanded' : 'desktop-integrated'}`}
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                        <div className="booking-bar">
                            {isExpanded && (
                                <button className="booking-close-btn" onClick={() => setIsExpanded(false)}>
                                    Close
                                </button>
                            )}
                            <div className="booking-field">
                                <div className="field-label">Check-in — Check-out</div>
                                <div className="field-value">
                                    <Calendar size={18} />
                                    <DatePicker
                                        selectsRange={true}
                                        startDate={startDate}
                                        endDate={endDate}
                                        onChange={(update) => {
                                            setDateRange(update);
                                        }}
                                        placeholderText="SELECT DATES"
                                        className="date-picker-input"
                                        dateFormat="MMM d"
                                    />
                                    <ChevronDown size={16} />
                                </div>
                            </div>

                            <div className="booking-divider"></div>

                            <div className="booking-field booking-guest-field">
                                <div className="field-label">Guests</div>
                                <div className="field-value" onClick={() => setIsGuestDropdownOpen(!isGuestDropdownOpen)}>
                                    <Users size={18} />
                                    <span>{guests.adults} Adults{guests.children > 0 && `, ${guests.children} Children`}</span>
                                    <ChevronDown size={16} />
                                </div>
                                {isGuestDropdownOpen && (
                                    <div className="guest-dropdown">
                                        <div className="guest-row">
                                            <span>Adults</span>
                                            <div className="guest-controls">
                                                <button onClick={(e) => { e.stopPropagation(); setGuests({ ...guests, adults: Math.max(1, guests.adults - 1) }) }}>-</button>
                                                <span>{guests.adults}</span>
                                                <button onClick={(e) => { e.stopPropagation(); setGuests({ ...guests, adults: guests.adults + 1 }) }}>+</button>
                                            </div>
                                        </div>
                                        <div className="guest-row">
                                            <span>Children</span>
                                            <div className="guest-controls">
                                                <button onClick={(e) => { e.stopPropagation(); setGuests({ ...guests, children: Math.max(0, guests.children - 1) }) }}>-</button>
                                                <span>{guests.children}</span>
                                                <button onClick={(e) => { e.stopPropagation(); setGuests({ ...guests, children: guests.children + 1 }) }}>+</button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <button
                                className="btn btn-primary booking-submit"
                                onClick={handleBookNow}
                            >
                                BOOK NOW
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default BookingBar;
