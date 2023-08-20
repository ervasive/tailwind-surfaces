import { describe, it, expect } from '@jest/globals';
import { SafeParseError, SafeParseSuccess, ZodIssueCode } from 'zod';
import { themeSchema } from './theme';
import { Theme } from '../types';

describe('themeSchema', () => {
  it('should catch error if no theme provided', () => {
    const result = themeSchema.safeParse(undefined);

    expect(result.success).toBe(false);

    const error = (result as SafeParseError<typeof result>).error;

    expect(error.issues.length).toBe(1);
    expect(error.issues[0].path).toEqual([]);
    expect(error.issues[0].code).toBe(ZodIssueCode.invalid_type);
  });

  it('should catch error if invalid "styles" provided', () => {
    const result = themeSchema.safeParse({
      tokens: {},
      surfaces: {},
      styles: 5,
    });

    expect(result.success).toBe(false);

    const error = (result as SafeParseError<typeof result>).error;

    expect(error.issues.length).toBe(1);
    expect(error.issues[0].path).toEqual(['styles']);
    expect(error.issues[0].code).toBe(ZodIssueCode.invalid_type);
  });

  it('should catch error if invalid styles item value provided', () => {
    const result = themeSchema.safeParse({
      tokens: {},
      surfaces: {},
      styles: {
        color: 5,
      },
    });

    expect(result.success).toBe(false);

    const error = (result as SafeParseError<typeof result>).error;

    expect(error.issues.length).toBe(1);
    expect(error.issues[0].path).toEqual(['styles', 'color']);
    expect(error.issues[0].code).toBe(ZodIssueCode.invalid_union);
  });

  it('should catch error if invalid "tokens" provided', () => {
    const result = themeSchema.safeParse({
      tokens: 5,
      surfaces: {},
    });

    expect(result.success).toBe(false);

    const error = (result as SafeParseError<typeof result>).error;

    expect(error.issues.length).toBe(1);
    expect(error.issues[0].path).toEqual(['tokens']);
    expect(error.issues[0].code).toBe(ZodIssueCode.invalid_type);
  });

  it('should catch error if invalid tokens item value provided', () => {
    const result = themeSchema.safeParse({
      tokens: {
        test: 5,
      },
      surfaces: {},
    });

    expect(result.success).toBe(false);

    const error = (result as SafeParseError<typeof result>).error;

    expect(error.issues.length).toBe(1);
    expect(error.issues[0].path).toEqual(['tokens', 'test']);
    expect(error.issues[0].code).toBe(ZodIssueCode.invalid_union);
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
  });

  it('should catch error if invalid surfaces item provided', () => {
    const result = themeSchema.safeParse({
      tokens: {},
      surfaces: {
        test: 5,
      },
    });

    expect(result.success).toBe(false);

    const error = (result as SafeParseError<typeof result>).error;

    expect(error.issues.length).toBe(1);
    expect(error.issues[0].path).toEqual(['surfaces', 'test']);
    expect(error.issues[0].code).toBe(ZodIssueCode.invalid_union);
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
