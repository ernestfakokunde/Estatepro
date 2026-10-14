import { Router } from 'express';
import { Role } from '@prisma/client';
import {
  create,
  detail,
  insights,
  list,
  mine,
  related,
  remove,
  update,
} from '../controllers/property.controller';
import { optionalAuth, requireAuth, requireRole } from '../middleware/auth';
import { validateBody } from '../middleware/validate';
import { propertyInputSchema } from '../validators/property';

const router = Router();

router.get('/', list);
router.get('/insights', insights);
router.get('/mine', requireAuth, requireRole(Role.AGENT, Role.ADMIN), mine);
router.get('/:id/related', related);
router.get('/:id', optionalAuth, detail);
router.post('/', requireAuth, requireRole(Role.AGENT, Role.ADMIN), validateBody(propertyInputSchema), create);
router.put(
  '/:id',
  requireAuth,
  requireRole(Role.AGENT, Role.ADMIN),
  validateBody(propertyInputSchema),
  update,
);
router.delete('/:id', requireAuth, requireRole(Role.AGENT, Role.ADMIN), remove);

export default router;
