import { Router } from 'express';
import { validate } from '../middleware/validate';
import { paymentLimiter } from '../middleware/rateLimiter';
import { createPaymentIntentSchema } from '../schemas/booking.schema';
import { createRazorpayOrder, verifyPayment } from '../controllers/payments.controller';

const router = Router();

// Create Razorpay order (called before checkout)
router.post('/create-order', paymentLimiter, validate(createPaymentIntentSchema), createRazorpayOrder);

// Verify payment after Razorpay callback
router.post('/verify', paymentLimiter, verifyPayment);

export default router;
