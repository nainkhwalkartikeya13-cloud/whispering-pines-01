import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { dashboard } from '../controllers/analytics.controller';

const router = Router();

router.get('/dashboard', requireAuth, dashboard);

export default router;
