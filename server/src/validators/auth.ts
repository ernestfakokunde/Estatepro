import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(254),
  password: z.string().min(8).max(72),
  phone: z.string().trim().max(32).optional().or(z.literal('')),
});

export const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1).max(72),
});
