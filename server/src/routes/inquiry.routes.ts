import { Router } from 'express';
import { create, list, listMine, updateStatus } from '../controllers/inquiry.controller';
import { optionalAuth, requireAuth, requireRole } from '../middleware/auth';
import { Role } from '@prisma/client';
import { validateBody } from '../middleware/validate';
import { inquirySchema } from '../validators/inquiry';
import { inquiryStatusSchema } from '../validators/inquiry';

const router = Router();
router.post('/', optionalAuth, validateBody(inquirySchema), create);
router.get('/mine', requireAuth, requireRole(Role.USER, Role.AGENT, Role.ADMIN), listMine);
router.get('/', requireAuth, requireRole(Role.AGENT, Role.ADMIN), list);
router.patch(
  '/:id/status',
  requireAuth,
  requireRole(Role.AGENT, Role.ADMIN),
  validateBody(inquiryStatusSchema),
  updateStatus,
);

export default router;
