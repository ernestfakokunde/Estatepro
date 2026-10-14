import { z } from 'zod';
import { propertyCategories, propertyTypes } from './constants';

export const loginSchema = z.object({
  email: z.string().trim().email('Enter a valid email address.'),
  password: z.string().min(1, 'Enter your password.'),
});
export const registerSchema = z.object({
  name: z.string().trim().min(2, 'Enter at least 2 characters.').max(80),
  email: z.string().trim().email('Enter a valid email address.'),
  phone: z.string().trim().max(32).optional(),
  password: z.string().min(8, 'Use at least 8 characters.').max(72),
});
export const agentRegisterSchema = registerSchema.extend({
  phone: z.string().trim().min(7, 'Enter a valid phone number.').max(32).regex(/^[+()\d\s.-]+$/, 'Enter a valid phone number.'),
  agency: z.string().trim().max(120).optional().or(z.literal('')),
  licenseNumber: z.string().trim().max(100).optional().or(z.literal('')),
  bio: z.string().trim().max(1200).optional().or(z.literal('')),
});
export const inquirySchema = z.object({
  name: z.string().trim().min(2, 'Enter your name.').max(80),
  email: z.string().trim().email('Enter a valid email address.'),
  phone: z.string().trim().max(32).optional(),
  message: z.string().trim().min(10, 'Write at least 10 characters.').max(4000),
  propertyId: z.string().optional(),
});
export const propertySchema = z.object({
  title: z.string().trim().min(5, 'Use at least 5 characters.').max(140),
  description: z.string().trim().min(30, 'Add at least 30 characters.').max(12000),
  price: z.coerce.number().positive('Enter a price above zero.').max(100000000000, 'Enter a lower price.'),
  type: z.enum(propertyTypes),
  category: z.enum(propertyCategories),
  bedrooms: z.coerce.number().int().min(0).max(100).nullable(),
  bathrooms: z.coerce.number().int().min(0).max(100).nullable(),
  area: z.coerce.number().positive('Enter the property area.').max(10000000),
  address: z.string().trim().min(5).max(220),
  city: z.string().trim().min(2).max(100),
  state: z.string().trim().min(2).max(100),
  lat: z.number().min(-90).max(90).nullable().optional(),
  lng: z.number().min(-180).max(180).nullable().optional(),
  featuresText: z
    .string()
    .optional()
    .refine(
      (value) => !value || value.split(',').filter((item) => item.trim()).length <= 30,
      'Add no more than 30 features.',
    ),
});

export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;
export type AgentRegisterValues = z.infer<typeof agentRegisterSchema>;
export type InquiryValues = z.infer<typeof inquirySchema>;
export type PropertyFormValues = z.infer<typeof propertySchema>;
