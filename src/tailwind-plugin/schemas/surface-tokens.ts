import { type ZodType, z } from 'zod';
import { type SurfaceTokens } from '../types';
import { tokenSchema } from './token';

export const surfaceTokensSchema: ZodType<SurfaceTokens> = z.record(
  tokenSchema,
  {
    required_error: 'tokens object is required',
    invalid_type_error:
      'invalid tokens, must be an object whose property values must be ' +
      'either a non-empty string, or a two-tuple of non-empty strings',
  },
);
