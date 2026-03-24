import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import './CinematicDivider.css';

const CinematicDivider = () => {
    const ref = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start end', 'end start'],
    });

    const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);

    return (
        <section className="cinematic-divider" ref={ref}>
            <motion.div
                className="cinematic-bg"
                style={{ y: backgroundY }}
            >
                <img
                    src="https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=1600&q=80"
                    alt="Waterfall cascading into mossy pool in Columbia Gorge"
                    className="cinematic-bg-img"
                />
            </motion.div>
            <div className="cinematic-overlay"></div>

            <div className="cinematic-content">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
                >
                    <blockquote className="cinematic-quote">
                        "The wilderness is not a luxury but a necessity of the human spirit."
                    </blockquote>
                    <cite className="cinematic-author">— Edward Abbey</cite>
                </motion.div>
            </div>
        </section>
    );
};

export default CinematicDivider;
