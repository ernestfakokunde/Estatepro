import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import {
  forgotPassword,
  login,
  logout,
  me,
  register,
  registerAgent,
  resendVerification,
  resetPassword,
  verifyEmail,
} from '../controllers/auth.controller';
import { requireAuth } from '../middleware/auth';
import { validateBody } from '../middleware/validate';
import {
  agentRegisterSchema,
  emailTokenSchema,
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
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
router.post('/verify-email', authLimiter, validateBody(emailTokenSchema), verifyEmail);
router.post('/resend-verification', authLimiter, validateBody(forgotPasswordSchema), resendVerification);
router.post('/forgot-password', authLimiter, validateBody(forgotPasswordSchema), forgotPassword);
router.post('/reset-password', authLimiter, validateBody(resetPasswordSchema), resetPassword);
router.post('/logout', logout);
router.get('/me', requireAuth, me);

export default router;
