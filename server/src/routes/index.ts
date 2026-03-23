import { Router } from 'express';
import authRouter from './auth.routes';
import accommodationsRouter from './accommodations.routes';
import bookingsRouter from './bookings.routes';
import servicesRouter from './services.routes';
import reviewsRouter from './reviews.routes';
import contactRouter from './contact.routes';
import paymentsRouter from './payments.routes';
import analyticsRouter from './analytics.routes';
import newsletterRouter from './newsletter.routes';

const router = Router();

router.use('/auth', authRouter);
router.use('/accommodations', accommodationsRouter);
router.use('/bookings', bookingsRouter);
router.use('/services', servicesRouter);
router.use('/reviews', reviewsRouter);
router.use('/contact', contactRouter);
router.use('/payments', paymentsRouter);
router.use('/analytics', analyticsRouter);
router.use('/newsletter', newsletterRouter);

export default router;
