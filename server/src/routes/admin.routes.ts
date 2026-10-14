import { Router } from 'express';
import { Role } from '@prisma/client';
import { moderateProperty, properties, summary, updateUser, users } from '../controllers/admin.controller';
import { requireAuth, requireRole } from '../middleware/auth';
import { validateBody } from '../middleware/validate';
import { userUpdateSchema } from '../validators/admin';
import { moderationSchema } from '../validators/property';

const router = Router();
router.use(requireAuth, requireRole(Role.ADMIN));
router.get('/summary', summary);
router.get('/properties', properties);
router.patch('/properties/:id/status', validateBody(moderationSchema), moderateProperty);
router.get('/users', users);
router.patch('/users/:id', validateBody(userUpdateSchema), updateUser);

export default router;
