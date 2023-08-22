import { z } from 'zod';
import { surfaceTokensSchema } from './surface-tokens';
import { surfaceSchema } from './surface';

export const surfaceUnionSchema = z.union(
  [surfaceTokensSchema, surfaceSchema],
  {
    errorMap: () => ({ message: 'invalid surface value' }),
  },
);
