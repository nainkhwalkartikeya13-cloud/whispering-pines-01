import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { list, getOne, create, update, deactivate } from '../controllers/accommodations.controller';

const router = Router();

router.get('/', list);
router.get('/:slug', getOne);
router.post('/', requireAuth, create);
router.put('/:id', requireAuth, update);
router.delete('/:id', requireAuth, deactivate);

export default router;
