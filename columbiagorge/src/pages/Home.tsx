
import Hero from '../components/Hero';
import SocialProof from '../components/SocialProof';
import Philosophy from '../components/Philosophy';
import ExperienceGrid from '../components/ExperienceGrid';
import CinematicDivider from '../components/CinematicDivider';
import EarthMap from '../components/EarthMap';
import { motion } from 'framer-motion';

const Home = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Hero />
            <SocialProof />
            <Philosophy />
            <ExperienceGrid />
            <CinematicDivider />
            <EarthMap />
        </motion.div>
    );
};

export default Home;
