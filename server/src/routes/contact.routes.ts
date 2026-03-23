import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { contactLimiter } from '../middleware/rateLimiter';
import { contactSchema } from '../schemas/contact.schema';
import { submit, listAdmin, markRead } from '../controllers/contact.controller';

const router = Router();

router.post('/', contactLimiter, validate(contactSchema), submit);
router.get('/submissions', requireAuth, listAdmin);
router.patch('/submissions/:id', requireAuth, markRead);

export default router;
