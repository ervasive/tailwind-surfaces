import { describe, it, expect } from '@jest/globals';
import { SafeParseError, SafeParseSuccess, ZodIssueCode } from 'zod';
import { surfaceSchema } from './surface';
import { Surface } from '../types';

describe('surfaceSchema', () => {
  it('should catch error if no surface provided', () => {
    const result = surfaceSchema.safeParse(undefined);

    expect(result.success).toBe(false);

    const error = (result as SafeParseError<typeof result>).error;

    expect(error.issues.length).toBe(1);
    expect(error.issues[0].path).toEqual([]);
    expect(error.issues[0].code).toBe(ZodIssueCode.invalid_type);
  });

  it('should catch error if invalid "extends" provided', () => {
    const result = surfaceSchema.safeParse({
      tokens: {},
      extends: 5,
    });

    expect(result.success).toBe(false);

    const error = (result as SafeParseError<typeof result>).error;

    expect(error.issues.length).toBe(1);
    expect(error.issues[0].path).toEqual(['extends']);
    expect(error.issues[0].code).toBe(ZodIssueCode.invalid_type);
  });

  it('should catch error if invalid "tokens" provided', () => {
    const result = surfaceSchema.safeParse({
      tokens: 5,
    });

    expect(result.success).toBe(false);

    const error = (result as SafeParseError<typeof result>).error;

    expect(error.issues.length).toBe(1);
    expect(error.issues[0].path).toEqual(['tokens']);
    expect(error.issues[0].code).toBe(ZodIssueCode.invalid_type);
  });

  it('should catch error if invalid "styles" provided', () => {
    const result = surfaceSchema.safeParse({
      styles: 5,
      tokens: {},
    });

    expect(result.success).toBe(false);

    const error = (result as SafeParseError<typeof result>).error;

    expect(error.issues.length).toBe(1);
    expect(error.issues[0].path).toEqual(['styles']);
    expect(error.issues[0].code).toBe(ZodIssueCode.invalid_type);
  });

  it('should return validated input', () => {
    const input = {
      extends: 'base',
      styles: {
        color: 'red',
      },
      tokens: {
        surface: 'green',
      },
    };
    const result = surfaceSchema.safeParse(input);

    expect(result.success).toBe(true);

    const data = (result as SafeParseSuccess<Surface>).data;

    expect(data).toEqual(input);
  });
});
