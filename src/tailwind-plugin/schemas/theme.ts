import { type ZodType, z } from 'zod';
import type { Theme } from '../types';
import { surfaceTokensSchema } from './surface-tokens';
import { stylesSchema } from './styles';
import { surfaceSchema } from './surface';

export const themeSchema: ZodType<Theme> = z.object(
  {
    tokens: surfaceTokensSchema,
    surfaces: z.record(
      z.union([surfaceTokensSchema, surfaceSchema], {
        errorMap: () => ({ message: 'invalid surface value' }),
      }),
      {
        invalid_type_error: 'invalid surfaces value, must be an object',
        required_error: 'theme must define surfaces object',
      },
    ),
    styles: stylesSchema.optional(),
  },
  {
    required_error: 'theme is required',
    invalid_type_error: 'invalid theme value',
  },
);
