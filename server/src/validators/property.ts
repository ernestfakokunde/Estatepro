import { PropertyCategory, PropertyType, PropertyStatus } from '@prisma/client';
import { z } from 'zod';

export const propertyImageSchema = z.object({
  url: z.string().url(),
  publicId: z.string().min(1),
  alt: z.string().trim().min(1).max(180),
});

export const propertyInputSchema = z.object({
  title: z.string().trim().min(5).max(140),
  description: z.string().trim().min(30).max(12000),
  price: z.coerce.number().positive().max(100000000000),
  type: z.nativeEnum(PropertyType),
  category: z.nativeEnum(PropertyCategory),
  bedrooms: z.coerce.number().int().min(0).max(100).nullable().optional(),
  bathrooms: z.coerce.number().int().min(0).max(100).nullable().optional(),
  area: z.coerce.number().positive().max(10000000),
  address: z.string().trim().min(5).max(220),
  city: z.string().trim().min(2).max(100),
  state: z.string().trim().min(2).max(100),
  lat: z.coerce.number().min(-90).max(90).nullable().optional(),
  lng: z.coerce.number().min(-180).max(180).nullable().optional(),
  features: z.array(z.string().trim().min(1).max(80)).max(30).default([]),
  images: z.array(propertyImageSchema).max(20).optional(),
});

export const propertyQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(12),
    type: z.nativeEnum(PropertyType).optional(),
    category: z.nativeEnum(PropertyCategory).optional(),
    bedrooms: z.coerce.number().int().min(0).optional(),
    minPrice: z.coerce.number().min(0).optional(),
    maxPrice: z.coerce.number().min(0).optional(),
    location: z.string().trim().max(120).optional(),
    city: z.string().trim().max(100).optional(),
    state: z.string().trim().max(100).optional(),
    q: z.string().trim().max(120).optional(),
    status: z.nativeEnum(PropertyStatus).optional(),
    sort: z.enum(['newest', 'oldest', 'price_asc', 'price_desc']).default('newest'),
  })
  .refine(
    (value) =>
      value.minPrice === undefined || value.maxPrice === undefined || value.minPrice <= value.maxPrice,
    { path: ['maxPrice'], message: 'Maximum price must be greater than or equal to minimum price.' },
  );

export const moderationSchema = z.object({ status: z.nativeEnum(PropertyStatus) });
