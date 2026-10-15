import type { ErrorRequestHandler } from 'express';
import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';
import { AppError } from '../utils/http';

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof ZodError) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Please check the submitted information.',
        details: error.flatten().fieldErrors,
      },
    });
  }
  if (error && typeof error === 'object' && 'type' in error && error.type === 'entity.too.large') {
    return res.status(413).json({
      success: false,
      error: { code: 'PAYLOAD_TOO_LARGE', message: 'The request is larger than the allowed size.' },
    });
  }
  if (error instanceof AppError) {
    return res
      .status(error.statusCode)
      .json({ success: false, error: { code: error.code, message: error.message } });
  }
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
    return res.status(409).json({
      success: false,
      error: { code: 'ALREADY_EXISTS', message: 'A record with that information already exists.' },
    });
  }
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
    return res
      .status(404)
      .json({ success: false, error: { code: 'NOT_FOUND', message: 'The requested record was not found.' } });
  }
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P1001') {
    console.error('Database is unreachable while handling an API request.', error);
    return res.status(503).json({
      success: false,
      error: { code: 'DATABASE_UNAVAILABLE', message: 'The database is temporarily unreachable. Please try again shortly.' },
    });
  }
  if (error instanceof Error && error.name === 'MulterError') {
    return res.status(400).json({ success: false, error: { code: 'UPLOAD_ERROR', message: error.message } });
  }
  console.error(error);
  return res.status(500).json({
    success: false,
    error: { code: 'INTERNAL_ERROR', message: 'Something went wrong. Please try again.' },
  });
};
