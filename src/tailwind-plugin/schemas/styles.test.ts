import { describe, it, expect } from '@jest/globals';
import { SafeParseError, SafeParseSuccess, ZodIssueCode } from 'zod';
import { stylesSchema } from './styles';
import { Token } from '../types';

describe('stylesSchema', () => {
  it('should catch error if no value provided', () => {
    const result = stylesSchema.safeParse(undefined);

    expect(result.success).toBe(false);

    const error = (result as SafeParseError<typeof result>).error;

    expect(error.issues.length).toBe(1);
    expect(error.issues[0].path).toEqual([]);
    expect(error.issues[0].code).toBe(ZodIssueCode.invalid_type);
    expect(error.issues[0].message).toMatch(/styles object is required/i);
  });

  it('should catch error if invalid value provided', () => {
    const result = stylesSchema.safeParse(5);

    expect(result.success).toBe(false);

    const error = (result as SafeParseError<typeof result>).error;

    expect(error.issues.length).toBe(1);
    expect(error.issues[0].path).toEqual([]);
    expect(error.issues[0].code).toBe(ZodIssueCode.invalid_type);
    expect(error.issues[0].message).toMatch(/invalid styles/i);
  });

  it('should return validated input', () => {
    const input = {
      color: 'value',
      fill: ['value', 'value-2'],
    };
    const result = stylesSchema.safeParse(input);

    expect(result.success).toBe(true);

    const data = (result as SafeParseSuccess<Record<string, Token>>).data;

    expect(data).toEqual(input);
  });
});
