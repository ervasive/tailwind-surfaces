import { describe, it, expect } from '@jest/globals';
import { SafeParseError, SafeParseSuccess, ZodIssueCode } from 'zod';
import { SurfaceTokens } from '../types';
import { surfaceTokensSchema } from './surface-tokens';

describe('surfaceTokensSchema', () => {
  it('should catch error if no value provided', () => {
    const result = surfaceTokensSchema.safeParse(undefined);

    expect(result.success).toBe(false);

    const error = (result as SafeParseError<typeof result>).error;

    expect(error.issues.length).toBe(1);
    expect(error.issues[0].path).toEqual([]);
    expect(error.issues[0].code).toBe(ZodIssueCode.invalid_type);
    expect(error.issues[0].message).toMatch(/tokens object is required/i);
  });

  it('should catch error if invalid value provided', () => {
    const result = surfaceTokensSchema.safeParse(5);

    expect(result.success).toBe(false);

    const error = (result as SafeParseError<typeof result>).error;

    expect(error.issues.length).toBe(1);
    expect(error.issues[0].path).toEqual([]);
    expect(error.issues[0].code).toBe(ZodIssueCode.invalid_type);
    expect(error.issues[0].message).toMatch(/invalid tokens/i);
  });

  it('should return validated input', () => {
    const input = {
      token: 'value',
      second: ['value', 'value-2'],
    };
    const result = surfaceTokensSchema.safeParse(input);

    expect(result.success).toBe(true);

    const data = (result as SafeParseSuccess<SurfaceTokens>).data;

    expect(data).toEqual(input);
  });
});
