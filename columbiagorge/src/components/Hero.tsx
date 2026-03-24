
import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import './Hero.css';

const Hero = () => {
    const navigate = useNavigate();
    const { scrollY } = useScroll();

    // Parallax 3D effect for background and text
    const backgroundY = useTransform(scrollY, [0, 1000], ['0%', '30%']);
    const backgroundScale = useTransform(scrollY, [0, 1000], [1, 1.1]);
    const textY = useTransform(scrollY, [0, 1000], ['0%', '60%']);
    const textOpacity = useTransform(scrollY, [0, 600], [1, 0]);

    return (
        <section className="hero">
            <motion.div
                className="hero-background"
                style={{ y: backgroundY, scale: backgroundScale }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5 }}
            >
                <div className="hero-overlay"></div>
                <video
                    className="hero-video"
                    autoPlay
                    loop
                    muted
                    playsInline
                >
                    <source src="https://videos.pexels.com/video-files/4287975/4287975-hd_1920_1080_24fps.mp4" type="video/mp4" />
                </video>
            </motion.div>

            <div className="hero-content">
                <motion.div
                    className="hero-text-wrapper"
                    style={{ y: textY, opacity: textOpacity }}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.5 }}
                >
                    <p className="hero-eyebrow">Where the River Meets the Forest</p>
                    <h1 className="hero-title">Escape Into<br />the Wild<br />Elegance</h1>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 1.2 }}
                    >
                        <button className="btn btn-outline hero-cta" onClick={() => navigate('/stay-with-us')}>Begin Your Journey</button>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
