import { Surface, SurfaceTokens } from '../types';

/**
 * Type guard to discriminate between Surface & SurfaceTokens types
 *
 * @param value - value to check
 *
 * @returns true if the given value of type Surface, false otherwise
 */
export const isSurface = (value: Surface | SurfaceTokens): value is Surface => {
  return 'tokens' in value && typeof value.tokens === 'object';
};
