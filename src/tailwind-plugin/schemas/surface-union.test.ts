import { describe, it, expect } from '@jest/globals';
import { SafeParseError, SafeParseSuccess, ZodIssueCode } from 'zod';
import { Surface, SurfaceTokens } from '../types';
import { surfaceUnionSchema } from './surface-union';

describe('surfaceUnionSchema', () => {
  it('should catch error if no value provided', () => {
    const result = surfaceUnionSchema.safeParse(undefined);

    expect(result.success).toBe(false);

    const error = (result as SafeParseError<typeof result>).error;

    expect(error.issues.length).toBe(1);
    expect(error.issues[0].path).toEqual([]);
    expect(error.issues[0].code).toBe(ZodIssueCode.invalid_union);
    expect(error.issues[0].message).toMatch(/invalid surface value/);
  });

  it('should catch error if invalid value type provided', () => {
    const result = surfaceUnionSchema.safeParse(5);

    expect(result.success).toBe(false);

    const error = (result as SafeParseError<typeof result>).error;

    expect(error.issues.length).toBe(1);
    expect(error.issues[0].path).toEqual([]);
    expect(error.issues[0].code).toBe(ZodIssueCode.invalid_union);
    expect(error.issues[0].message).toMatch(/invalid surface value/);
  });

  it('should catch error if invalid item provided', () => {
    const result = surfaceUnionSchema.safeParse({
      test: 5,
    });

    expect(result.success).toBe(false);

    const error = (result as SafeParseError<typeof result>).error;

    expect(error.issues.length).toBe(1);
    expect(error.issues[0].path).toEqual([]);
    expect(error.issues[0].code).toBe(ZodIssueCode.invalid_union);
    expect(error.issues[0].message).toMatch(/invalid surface value/i);
  });

  it.only('should validate for SurfaceTokens input', () => {
    const input = {
      one: 'basic-one-val',
      two: 'basic-two-val',
    };
    const result = surfaceUnionSchema.safeParse(input);

    expect(result.success).toBe(true);

    const data = (result as SafeParseSuccess<Surface | SurfaceTokens>).data;

    expect(data).toEqual(input);
  });

  it.only('should validate for Surface input', () => {
    const input = {
      tokens: {
        one: 'basic-one-val',
        two: 'basic-two-val',
      },
    };
    const result = surfaceUnionSchema.safeParse(input);

    expect(result.success).toBe(true);

    const data = (result as SafeParseSuccess<Surface | SurfaceTokens>).data;

    expect(data).toEqual(input);
  });
});
