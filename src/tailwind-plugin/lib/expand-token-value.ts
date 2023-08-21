import { Token } from '../types';
import { transformTokenValue } from './transform-token-value';

/**
 * Expand token value for light & dark color schemes
 *
 * @param token - token to expand
 * @param prefix - prefix value for CSS custom properties from the plugin options
 *
 * @returns expanded token values for light & dark color schemes
 */
export function expandTokenValue(
  token: Token,
  prefix: string,
): { light: string; dark: string } {
  if (Array.isArray(token)) {
    return {
      light: transformTokenValue(token[0], prefix),
      dark: transformTokenValue(token[1], prefix),
    };
  } else {
    return {
      light: transformTokenValue(token, prefix),
      dark: transformTokenValue(token, prefix),
    };
  }
}
