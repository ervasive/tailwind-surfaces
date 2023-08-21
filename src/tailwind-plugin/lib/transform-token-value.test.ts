import { describe, it, expect } from '@jest/globals';
import { transformTokenValue } from './transform-token-value';

describe('transformTokenValue', () => {
  it('should return trimmed value', () => {
    expect(transformTokenValue('  value  ', 'prefix-')).toBe('value');
  });

  it('should return theme value if colors. are present in value', () => {
    expect(transformTokenValue('colors.white', 'prefix-')).toBe(
      'theme(colors.white)',
    );
  });

  it('should transform var value and prepend prefix', () => {
    expect(transformTokenValue('var(strong)', 'prefix-')).toBe(
      'var(--prefix-strong)',
    );
  });
});
