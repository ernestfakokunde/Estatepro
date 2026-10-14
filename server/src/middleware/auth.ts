import type { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { Role } from '@prisma/client';
import { env } from '../config/env';
import { prisma } from '../config/prisma';
import { AppError } from '../utils/http';

function decodeUser(token: string) {
  const decoded = jwt.verify(token, env.JWT_SECRET);
  if (typeof decoded === 'string' || !decoded.sub) return null;
  return { id: decoded.sub };
}

export const optionalAuth: RequestHandler = async (req, _res, next) => {
  const token = req.cookies?.[env.AUTH_COOKIE_NAME];
  if (!token) return next();
  let payload: { id: string } | null;
  try {
    payload = decodeUser(token);
  } catch {
    // Invalid or expired optional cookies do not block public routes.
    return next();
  }
  if (!payload) return next();
  const user = await prisma.user.findUnique({ where: { id: payload.id } });
  if (user?.isActive) req.user = { id: user.id, role: user.role, email: user.email, name: user.name };
  return next();
};

export const requireAuth: RequestHandler = async (req, _res, next) => {
  const token = req.cookies?.[env.AUTH_COOKIE_NAME];
  if (!token) return next(new AppError('Sign in to continue.', 401, 'UNAUTHENTICATED'));
  let payload: { id: string } | null;
  try {
    payload = decodeUser(token);
  } catch {
    return next(new AppError('Your session has expired. Sign in again.', 401, 'INVALID_SESSION'));
  }
  if (!payload) return next(new AppError('Your session is invalid. Sign in again.', 401, 'INVALID_SESSION'));
  const user = await prisma.user.findUnique({ where: { id: payload.id } });
  if (!user || !user.isActive)
    return next(new AppError('Your session is no longer active.', 401, 'INVALID_SESSION'));
  req.user = { id: user.id, role: user.role, email: user.email, name: user.name };
  return next();
};

export function requireRole(...roles: Role[]): RequestHandler {
  return (req, _res, next) => {
    if (!req.user) return next(new AppError('Sign in to continue.', 401, 'UNAUTHENTICATED'));
    if (!roles.includes(req.user.role))
      return next(new AppError('You do not have permission to do that.', 403, 'FORBIDDEN'));
    return next();
  };
}
