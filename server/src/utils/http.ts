import type { Response } from 'express';

export function sendData<T>(res: Response, data: T, status = 200) {
  return res.status(status).json({ success: true, data });
}

export function sendPage<T>(res: Response, data: T, page: number, limit: number, total: number) {
  return res.status(200).json({
    success: true,
    data,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
}

export class AppError extends Error {
  constructor(
    message: string,
    public statusCode = 500,
    public code = 'INTERNAL_ERROR',
  ) {
    super(message);
    this.name = 'AppError';
  }
}
