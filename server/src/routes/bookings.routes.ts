import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { bookingLookupLimiter } from '../middleware/rateLimiter';
import { checkAvailabilitySchema } from '../schemas/booking.schema';
import {
  checkAvailabilityHandler,
  listAdmin,
  updateStatus,
  guestLookup,
} from '../controllers/bookings.controller';

const router = Router();

router.post('/check-availability', validate(checkAvailabilitySchema), checkAvailabilityHandler);
router.post('/lookup', bookingLookupLimiter, guestLookup);
router.get('/', requireAuth, listAdmin);
router.patch('/:id/status', requireAuth, updateStatus);

export default router;
