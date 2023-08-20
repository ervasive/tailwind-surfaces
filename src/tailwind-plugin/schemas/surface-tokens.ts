import { type ZodType, z } from 'zod';
import { type SurfaceTokens } from '../types';
import { tokenSchema } from './token';

export const surfaceTokensSchema: ZodType<SurfaceTokens> =
  z.record(tokenSchema);
