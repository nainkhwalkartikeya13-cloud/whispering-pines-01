
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Tilt from 'react-parallax-tilt';
import './ExperienceGrid.css';

const accommodations = [
    {
        id: 1,
        title: 'The Creekside Yurt Collection',
        description: '700 sq. ft. of refined living space with vaulted ceilings, a private sleeping loft, and radiant floor heating — all just steps from the whispering creek.',
        image: 'https://images.unsplash.com/photo-1464207687429-7505649dae38?w=1200&q=80',
        size: 'large',
        path: '/luxury-yurts',
    },
    {
        id: 2,
        title: 'The Woodland Safari Tents',
        description: 'Wake to birdsong in these immersive forest dwellings, blending raw nature with boutique comfort and year-round climate control.',
        image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1200&q=80',
        size: 'medium',
        path: '/safari-tents',
    },
    {
        id: 3,
        title: 'The Evergreen Bell Tents',
        description: 'A cozy, bohemian-chic retreat suspended amongst ancient evergreens — effortless simplicity at its finest.',
        image: 'https://images.unsplash.com/photo-1478827536114-da961b7f86d2?w=1200&q=80',
        size: 'small',
        path: '/bell-tents',
    },
    {
        id: 4,
        title: 'The Wilderness Campsites',
        description: 'Reconnect with the earth on our curated forest sites — complete with fire rings, starlit canopies, and access to every resort amenity.',
        image: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=1200&q=80',
        size: 'medium',
        path: '/campsites',
    }
];

const ExperienceGrid = () => {
    const navigate = useNavigate();
    return (
        <section className="experience-section">
            <div className="container" style={{ paddingTop: '8rem', paddingBottom: '4rem' }}>
                <div className="experience-header">
                    <h2 className="section-title">Our Sanctuaries</h2>
                    <p className="section-subtitle">Each dwelling is a handcrafted haven — designed to dissolve the boundary between shelter and wilderness.</p>
                </div>
            </div>

            <div className="alternating-blocks">
                {accommodations.map((item, index) => (
                    <div
                        key={item.id}
                        className={`alt-block ${index % 2 !== 0 ? 'alt-reverse' : ''}`}
                    >
                        <motion.div
                            className="alt-image-container"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <Tilt tiltMaxAngleX={4} tiltMaxAngleY={4} perspective={1000} transitionSpeed={1500} scale={1.02} className="tilt-wrapper">
                                <img src={item.image} alt={item.title} className="alt-image" />
                            </Tilt>
                        </motion.div>
                        <motion.div
                            className="alt-text-container"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            <div className="alt-text-content">
                                <h3 className="alt-title">{item.title}</h3>
                                <p className="alt-description">{item.description}</p>
                                <button className="btn btn-outline alt-btn" onClick={() => navigate(item.path)}>Explore</button>
                            </div>
                        </motion.div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default ExperienceGrid;
