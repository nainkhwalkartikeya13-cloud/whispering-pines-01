import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import './PageHero.css';

interface PageHeroProps {
  image: string;
  subLabel?: string;
  title: string;
  description?: string;
  height?: 'tall' | 'medium' | 'short';
}

const FADE_UP = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: i * 0.15, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  }),
};

export default function PageHero({ image, subLabel, title, description, height = 'tall' }: PageHeroProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div ref={ref} className={`page-hero page-hero--${height}`}>
      <motion.img
        src={image}
        alt=""
        className="page-hero__image"
        style={{ y: imgY }}
        loading="eager"
      />
      <div className="page-hero__overlay" />
      <motion.div className="page-hero__content" style={{ opacity: contentOpacity }}>
        {subLabel && (
          <motion.p className="page-hero__sublabel" variants={FADE_UP} initial="hidden" animate="visible" custom={0}>
            {subLabel}
          </motion.p>
        )}
        <motion.h1 className="page-hero__title" variants={FADE_UP} initial="hidden" animate="visible" custom={1}>
          {title}
        </motion.h1>
        {description && (
          <motion.p className="page-hero__description" variants={FADE_UP} initial="hidden" animate="visible" custom={2}>
            {description}
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}
