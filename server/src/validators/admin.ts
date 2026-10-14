import { Role } from '@prisma/client';
import { z } from 'zod';

export const userUpdateSchema = z
  .object({
    role: z.nativeEnum(Role).optional(),
    isActive: z.boolean().optional(),
  })
  .refine((value) => value.role !== undefined || value.isActive !== undefined, {
    message: 'Provide a role or account status to update.',
  });
