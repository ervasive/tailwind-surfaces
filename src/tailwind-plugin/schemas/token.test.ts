import { describe, it, expect } from '@jest/globals';
import { SafeParseError, SafeParseSuccess, ZodIssueCode } from 'zod';
import { Token } from '../types';
import { tokenSchema } from './token';

describe('tokenSchema', () => {
  it('should catch error on invalid value type', () => {
    [undefined, 5].forEach((v) => {
      const result = tokenSchema.safeParse(v);

      expect(result.success).toBe(false);

      const error = (result as SafeParseError<typeof result>).error;

      expect(error.issues.length).toBe(1);
      expect(error.issues[0].path).toEqual([]);
      expect(error.issues[0].code).toBe(ZodIssueCode.invalid_union);
      expect(error.issues[0].message).toMatch(/invalid token value/i);
    });
  });

  it('should catch error if invalid "token" tuple length is provided', () => {
    const result = tokenSchema.safeParse(['one', 'two', 'three']);

    expect(result.success).toBe(false);

    const error = (result as SafeParseError<typeof result>).error;

    expect(error.issues.length).toBe(1);
    expect(error.issues[0].path).toEqual([]);
    expect(error.issues[0].code).toBe(ZodIssueCode.too_big);
    expect(error.issues[0].message).toMatch(/invalid token value/i);
  });

  it('should return validated string input', () => {
    const result = tokenSchema.safeParse('value');

    expect(result.success).toBe(true);

    const data = (result as SafeParseSuccess<Token>).data;

    expect(data).toBe('value');
  });

  it('should return validated tuple input', () => {
    const result = tokenSchema.safeParse(['value', 'value-2']);

    expect(result.success).toBe(true);

    const data = (result as SafeParseSuccess<Token>).data;

    expect(data).toEqual(['value', 'value-2']);
  });
});
