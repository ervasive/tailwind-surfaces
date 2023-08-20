import { type ZodType, z } from 'zod';
import { stylesSchema } from './styles';
import { surfaceTokensSchema } from './surface-tokens';
import type { Surface } from '../types';

export const surfaceSchema: ZodType<Surface> = z.object({
  extends: z.string().optional(),
  tokens: surfaceTokensSchema,
  styles: stylesSchema.optional(),
});
