import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  DIRECT_URL: z.string().min(1, 'DIRECT_URL is required'),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must contain at least 32 characters'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  AUTH_COOKIE_NAME: z.string().min(1).default('estatepro_session'),
  AUTH_COOKIE_SAME_SITE: z.enum(['lax', 'strict', 'none']).default('lax'),
  AUTH_COOKIE_MAX_AGE_MS: z.coerce.number().int().positive().default(604800000),
  CLIENT_URL: z.string().url(),
  BCRYPT_ROUNDS: z.coerce.number().int().min(10).max(15).default(12),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(900000),
  RATE_LIMIT_MAX: z.coerce.number().int().positive().default(120),
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
  CLOUDINARY_FOLDER: z.string().default('estatepro'),
});

const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  console.error('Invalid server environment:', parsed.error.flatten().fieldErrors);
  throw new Error('Set the required values in server/.env before starting the API.');
}

export const env = parsed.data;
