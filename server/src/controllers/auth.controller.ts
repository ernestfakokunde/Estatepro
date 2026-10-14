import type { RequestHandler } from 'express';
import { env } from '../config/env';
import { prisma } from '../config/prisma';
import {
  authenticateUser,
  createSessionToken,
  registerAgent as registerAgentUser,
  registerUser,
  resetPasswordWithToken,
  sendPasswordResetLink,
  sendVerificationLink,
  verifyEmailToken,
} from '../services/auth.service';
import { AppError, sendData } from '../utils/http';

function setSessionCookie(res: Parameters<RequestHandler>[1], token: string) {
  res.cookie(env.AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production' || env.AUTH_COOKIE_SAME_SITE === 'none',
    sameSite: env.AUTH_COOKIE_SAME_SITE,
    path: '/',
    maxAge: env.AUTH_COOKIE_MAX_AGE_MS,
  });
}

function publicUser(user: {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  avatarUrl: string | null;
  createdAt: Date;
}) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    avatarUrl: user.avatarUrl,
    createdAt: user.createdAt,
  };
}

export const register: RequestHandler = async (req, res) => {
  const user = await registerUser(req.body);
  await sendVerificationLink(user.id, user.email);
  return sendData(res, { message: 'Account created. Check your email for a verification link.' }, 201);
};

export const registerAgent: RequestHandler = async (req, res) => {
  const user = await registerAgentUser(req.body);
  await sendVerificationLink(user.id, user.email);
  return sendData(res, { message: 'Application received. Verify your email; an admin will review your application.' }, 201);
};

export const verifyEmail: RequestHandler = async (req, res) => {
  const result = await verifyEmailToken(String(req.body.token));
  return sendData(res, {
    message: result.agentApplicationPending
      ? 'Email verified. Your agent application is waiting for admin review.'
      : 'Email verified. You can now sign in.',
  });
};

export const resendVerification: RequestHandler = async (req, res) => {
  const email = String(req.body.email).trim().toLowerCase();
  const user = await prisma.user.findUnique({ where: { email } });
  if (user && !user.emailVerified) await sendVerificationLink(user.id, user.email);
  return sendData(res, { message: 'If that address needs verification, a link has been sent.' });
};

export const forgotPassword: RequestHandler = async (req, res) => {
  const email = String(req.body.email).trim().toLowerCase();
  const user = await prisma.user.findUnique({ where: { email } });
  if (user) await sendPasswordResetLink(user.id, user.email);
  return sendData(res, { message: 'If an account exists for that address, a reset link has been sent.' });
};

export const resetPassword: RequestHandler = async (req, res) => {
  await resetPasswordWithToken(String(req.body.token), String(req.body.password));
  return sendData(res, { message: 'Password updated. You can sign in with your new password.' });
};

export const login: RequestHandler = async (req, res) => {
  const user = await authenticateUser(req.body);
  setSessionCookie(res, createSessionToken(user));
  return sendData(res, { user: publicUser(user) });
};

export const logout: RequestHandler = (_req, res) => {
  res.clearCookie(env.AUTH_COOKIE_NAME, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production' || env.AUTH_COOKIE_SAME_SITE === 'none',
    sameSite: env.AUTH_COOKIE_SAME_SITE,
    path: '/',
  });
  return sendData(res, { message: 'You have signed out.' });
};

export const me: RequestHandler = (req, res) => {
  if (!req.user) throw new AppError('Sign in to continue.', 401, 'UNAUTHENTICATED');
  const { id, name, email, role } = req.user;
  return sendData(res, { user: { id, name, email, role } });
};
