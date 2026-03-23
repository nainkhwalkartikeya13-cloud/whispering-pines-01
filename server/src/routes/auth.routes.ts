import { Router } from 'express';
import { authLimiter } from '../middleware/rateLimiter';
import { validate } from '../middleware/validate';
import { requireAuth } from '../middleware/auth';
import { loginSchema } from '../schemas/auth.schema';
import { login, me } from '../controllers/auth.controller';

const router = Router();

router.post('/login', authLimiter, validate(loginSchema), login);
router.get('/me', requireAuth, me);

export default router;
