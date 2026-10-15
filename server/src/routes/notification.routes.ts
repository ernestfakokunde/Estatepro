import { Router } from 'express';
import { list, markAllRead, markRead, unreadCount } from '../controllers/notification.controller';
import { requireAuth } from '../middleware/auth';

const router = Router();
router.use(requireAuth);
router.get('/unread-count', unreadCount);
router.get('/', list);
router.patch('/read-all', markAllRead);
router.patch('/:id/read', markRead);

export default router;
