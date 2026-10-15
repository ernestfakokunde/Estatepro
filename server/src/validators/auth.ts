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

export const agentRegisterSchema = registerSchema.extend({
  phone: z.string().trim().min(7).max(32).regex(/^[+()\d\s.-]+$/, 'Enter a valid phone number.'),
  agency: z.string().trim().max(120).optional().or(z.literal('')),
  licenseNumber: z.string().trim().max(100).optional().or(z.literal('')),
  bio: z.string().trim().max(1200).optional().or(z.literal('')),
});

