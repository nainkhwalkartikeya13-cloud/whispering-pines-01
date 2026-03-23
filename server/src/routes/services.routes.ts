import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createServiceSchema, updateServiceSchema } from '../schemas/service.schema';
import { list, create, update, remove } from '../controllers/services.controller';

const router = Router();

router.get('/', list);
router.post('/', requireAuth, validate(createServiceSchema), create);
router.put('/:id', requireAuth, validate(updateServiceSchema), update);
router.delete('/:id', requireAuth, remove);

export default router;
