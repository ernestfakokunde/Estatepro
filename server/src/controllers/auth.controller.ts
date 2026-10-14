import type { RequestHandler } from 'express';
import { env } from '../config/env';
import { authenticateUser, createSessionToken, registerUser } from '../services/auth.service';
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
  setSessionCookie(res, createSessionToken(user));
  return sendData(res, { user: publicUser(user) }, 201);
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
