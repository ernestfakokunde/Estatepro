import type { RequestHandler } from 'express';
import { env } from '../config/env';
import { AppError } from '../utils/http';

const mutatingMethods = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

export const originGuard: RequestHandler = (req, _res, next) => {
  const origin = req.get('origin');
  if (origin && mutatingMethods.has(req.method) && origin !== env.CLIENT_URL) {
    return next(new AppError('This request origin is not allowed.', 403, 'ORIGIN_NOT_ALLOWED'));
  }
  return next();
};
