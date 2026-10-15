import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import {
  login,
  logout,
  me,
  register,
  registerAgent,
} from '../controllers/auth.controller';
import { requireAuth } from '../middleware/auth';
import { validateBody } from '../middleware/validate';
import {
  agentRegisterSchema,
  loginSchema,
  registerSchema,
} from '../validators/auth';
import { env } from '../config/env';

const router = Router();
const authLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  limit: 15,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  skip: (req) => req.method === 'OPTIONS',
});

router.post('/register', authLimiter, validateBody(registerSchema), register);
router.post('/register-agent', authLimiter, validateBody(agentRegisterSchema), registerAgent);
router.post('/login', authLimiter, validateBody(loginSchema), login);
router.post('/logout', logout);
router.get('/me', requireAuth, me);

export default router;
