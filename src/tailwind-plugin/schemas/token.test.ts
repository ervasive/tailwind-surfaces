import { describe, it, expect } from '@jest/globals';
import { SafeParseError, SafeParseSuccess, ZodIssueCode } from 'zod';
import { tokenSchema } from './token';
import { Token } from '../types';

describe('tokenSchema', () => {
  it('should catch error if no tokenSchema provided', () => {
    const result = tokenSchema.safeParse(undefined);

    expect(result.success).toBe(false);

    const error = (result as SafeParseError<typeof result>).error;

    expect(error.issues.length).toBe(1);
    expect(error.issues[0].path).toEqual([]);
    expect(error.issues[0].code).toBe(ZodIssueCode.invalid_union);
  });

  it('should catch error if invalid "token" type provided', () => {
    const result = tokenSchema.safeParse(5);

    expect(result.success).toBe(false);

    const error = (result as SafeParseError<typeof result>).error;

    expect(error.issues.length).toBe(1);
    expect(error.issues[0].path).toEqual([]);
    expect(error.issues[0].code).toBe(ZodIssueCode.invalid_union);
  });

  it('should catch error if invalid "token" tuple length is provided', () => {
    const result = tokenSchema.safeParse(['one', 'two', 'three']);

    expect(result.success).toBe(false);

    const error = (result as SafeParseError<typeof result>).error;

    expect(error.issues.length).toBe(1);
    expect(error.issues[0].path).toEqual([]);
    expect(error.issues[0].code).toBe(ZodIssueCode.too_big);
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
