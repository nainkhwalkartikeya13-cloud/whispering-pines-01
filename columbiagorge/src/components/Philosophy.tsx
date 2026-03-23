import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import './Philosophy.css';

const Philosophy = () => {
    const ref = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start end', 'end start'],
    });

    const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);

    return (
        <section className="philosophy-section" ref={ref}>
            <motion.div
                className="philosophy-bg"
                style={{ y: backgroundY }}
            >
                <img
                    src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1600&q=80"
                    alt="Sunlight through ancient forest"
                    className="philosophy-bg-img"
                />
            </motion.div>
            <div className="philosophy-overlay"></div>

            <div className="philosophy-content">
                <motion.div
                    className="philosophy-inner"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
                >
                    <p className="philosophy-eyebrow">Our Philosophy</p>
                    <h2 className="philosophy-title">Where Luxury Lives<br />in Harmony with Nature</h2>
                    <p className="philosophy-body">
                        We believe the most extraordinary experiences emerge when human craft meets untamed
                        wilderness. Every detail — from the hand-stitched canvas to the crackling fire pit — is
                        designed to deepen your connection to the ancient forests and rushing waters of the
                        Columbia River Gorge.
                    </p>
                </motion.div>
            </div>
        </section>
    );
};

export default Philosophy;
