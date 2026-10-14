import { Router } from 'express';
import { add, list, remove } from '../controllers/favorites.controller';
import { requireAuth } from '../middleware/auth';

const router = Router();
router.use(requireAuth);
router.get('/', list);
router.post('/:propertyId', add);
router.delete('/:propertyId', remove);

export default router;
