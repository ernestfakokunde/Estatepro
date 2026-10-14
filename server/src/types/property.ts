import type { z } from 'zod';
import type { propertyInputSchema, propertyQuerySchema } from '../validators/property';

export type PropertyInput = z.infer<typeof propertyInputSchema>;
export type PropertyQuery = z.infer<typeof propertyQuerySchema>;
