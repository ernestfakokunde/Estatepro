import { z } from 'zod';
import { InquiryStatus } from '@prisma/client';

export const inquirySchema = z.object({
  propertyId: z.string().min(1).optional(),
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().max(32).optional().or(z.literal('')),
  message: z.string().trim().min(10).max(4000),
});

export const inquiryStatusSchema = z.object({ status: z.nativeEnum(InquiryStatus) });
