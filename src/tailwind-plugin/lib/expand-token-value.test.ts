import { describe, it, expect } from '@jest/globals';
import { expandTokenValue } from './expand-token-value';

describe('expandTokenValue', () => {
  it('should expand string token into scheme independed entries', () => {
    expect(expandTokenValue('red', 'prefix-')).toEqual({
      light: 'red',
      dark: 'red',
    });
  });

  it('should transform tuple token', () => {
    expect(expandTokenValue(['white', 'black'], 'prefix-')).toEqual({
      light: 'white',
      dark: 'black',
    });
  });

  it('should transform token values', () => {
    expect(
      expandTokenValue(['colors.white', 'var(strong)'], 'prefix-'),
    ).toEqual({
      light: 'theme(colors.white)',
      dark: 'var(--prefix-strong)',
    });
  });
});
