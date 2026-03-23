import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { reviewLimiter } from '../middleware/rateLimiter';
import { createReviewSchema } from '../schemas/review.schema';
import { listPublic, listAdmin, create, update, remove } from '../controllers/reviews.controller';

const router = Router();

router.get('/', listPublic);
router.get('/admin', requireAuth, listAdmin);
router.post('/', reviewLimiter, validate(createReviewSchema), create);
router.patch('/:id', requireAuth, update);
router.delete('/:id', requireAuth, remove);

export default router;
