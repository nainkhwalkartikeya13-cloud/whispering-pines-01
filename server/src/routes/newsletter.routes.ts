import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { subscribe, listAdmin } from '../controllers/newsletter.controller';

const router = Router();

router.post('/', subscribe);
router.get('/admin', requireAuth, listAdmin);

export default router;
