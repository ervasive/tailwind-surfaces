import { describe, it, expect } from '@jest/globals';
import { SafeParseError, SafeParseSuccess, ZodIssueCode } from 'zod';
import { Theme } from '../types';
import { themeSchema } from './theme';

describe('themeSchema', () => {
  it('should catch error if no value provided', () => {
    const result = themeSchema.safeParse(undefined);

    expect(result.success).toBe(false);

    const error = (result as SafeParseError<typeof result>).error;

    expect(error.issues.length).toBe(1);
    expect(error.issues[0].path).toEqual([]);
    expect(error.issues[0].code).toBe(ZodIssueCode.invalid_type);
    expect(error.issues[0].message).toMatch(/theme is required/);
  });

  it('should catch error if invalid value type provided', () => {
    const result = themeSchema.safeParse(5);

    expect(result.success).toBe(false);

    const error = (result as SafeParseError<typeof result>).error;

    expect(error.issues.length).toBe(1);
    expect(error.issues[0].path).toEqual([]);
    expect(error.issues[0].code).toBe(ZodIssueCode.invalid_type);
    expect(error.issues[0].message).toMatch(/invalid theme value/);
  });

  it('should catch error if invalid "surfaces" provided', () => {
    const result = themeSchema.safeParse({
      tokens: {},
      surfaces: 5,
    });

    expect(result.success).toBe(false);

    const error = (result as SafeParseError<typeof result>).error;

    expect(error.issues.length).toBe(1);
    expect(error.issues[0].path).toEqual(['surfaces']);
    expect(error.issues[0].code).toBe(ZodIssueCode.invalid_type);
    expect(error.issues[0].message).toMatch(/invalid surfaces value/i);
  });

  it.only('should return validated input', () => {
    const input = {
      tokens: {
        one: 'one-val',
      },
      surfaces: {
        basic: {
          one: 'basic-one-val',
        },
        test: {
          tokens: {
            one: 'test-one-val',
          },
        },
      },
    };
    const result = themeSchema.safeParse(input);

    expect(result.success).toBe(true);

    const data = (result as SafeParseSuccess<Theme>).data;

    expect(data).toEqual(input);
  });
});
