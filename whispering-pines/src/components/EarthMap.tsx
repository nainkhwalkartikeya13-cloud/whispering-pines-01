import { motion } from 'framer-motion';
import { MapPin, Phone, Mail } from 'lucide-react';
import './EarthMap.css';

const EarthMap = () => {
    return (
        <section className="earth-map-section">
            <div className="earth-map-split">
                <div className="map-info-side">
                    <motion.div
                        className="map-info-content"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                    >
                        <p className="info-eyebrow">Your Journey Starts Here</p>
                        <h2 className="info-title">Find Us in the Gorge</h2>
                        <div className="map-details">
                            <div className="map-detail-item">
                                <MapPin size={24} strokeWidth={1.5} className="detail-icon" />
                                <div>
                                    <h3>Address</h3>
                                    <p>1101 Bear Creek Rd<br />Carson, WA 98610</p>
                                </div>
                            </div>
                            <div className="map-detail-item">
                                <Phone size={24} strokeWidth={1.5} className="detail-icon" />
                                <div>
                                    <h3>Telephone</h3>
                                    <p>(555) 123-4567</p>
                                </div>
                            </div>
                            <div className="map-detail-item">
                                <Mail size={24} strokeWidth={1.5} className="detail-icon" />
                                <div>
                                    <h3>Email</h3>
                                    <p>hello@columbiagorgegetaways.com</p>
                                </div>
                            </div>
                        </div>
                        <a href="https://maps.google.com/maps?q=Columbia%20Gorge%20Getaways,%201101%20Bear%20Creek%20Road,%20Carson,%20WA" target="_blank" rel="noopener noreferrer" className="btn btn-primary map-action-btn">
                            Get Directions
                        </a>
                    </motion.div>
                </div>
                <div className="map-visual-side">
                    <iframe
                        title="Whispering Pines Retreats Location"
                        className="google-map-iframe-split"
                        src="https://maps.google.com/maps?q=Columbia%20Gorge%20Getaways,%201101%20Bear%20Creek%20Road,%20Carson,%20WA%2098610&t=&z=11&ie=UTF8&iwloc=&output=embed"
                        loading="lazy"
                    ></iframe>
                </div>
            </div>
        </section>
    );
};

export default EarthMap;
