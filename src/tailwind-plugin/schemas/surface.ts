import { ZodType, z } from 'zod';
import { Surface } from '../types';
import { tokenSchema } from './token';

export const surfaceSchema: ZodType<Surface> = z.object({
  tokens: z.record(tokenSchema),
  extends: z.string().optional(),
  styles: z.record(tokenSchema).optional(),
  children: z
    .record(z.union([z.record(tokenSchema), z.lazy(() => surfaceSchema)]))
    .optional(),
});
