import { type ZodType, z } from 'zod';
import { surfaceTokensSchema } from './surface-tokens';
import { stylesSchema } from './styles';
import { surfaceSchema } from './surface';
import type { Theme } from '../types';

export const themeSchema: ZodType<Theme> = z.object({
  tokens: surfaceTokensSchema,
  styles: stylesSchema.optional(),
  surfaces: z.record(z.union([surfaceTokensSchema, surfaceSchema])),
});
