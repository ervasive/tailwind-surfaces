import { describe, it, expect } from '@jest/globals';
import { pluginOptionsSchema } from './plugin-options';
import { SafeParseError, SafeParseSuccess, ZodIssueCode } from 'zod';
import { PluginOptions } from '../types';
import { CLASSNAMES_PREFIX, VARS_PREFIX } from '../../constants';

describe('pluginOptionsSchema', () => {
  it('should catch error if no options provided', () => {
    const result = pluginOptionsSchema.safeParse(undefined);

    expect(result.success).toBe(false);

    const error = (result as SafeParseError<typeof result>).error;

    expect(error.issues.length).toBe(1);
    expect(error.issues[0].path).toEqual([]);
    expect(error.issues[0].code).toBe(ZodIssueCode.invalid_type);
  });

  it('should catch error if invalid "varsPrefix" provided', () => {
    const result = pluginOptionsSchema.safeParse({ varsPrefix: 5 });

    expect(result.success).toBe(false);

    const error = (result as SafeParseError<typeof result>).error;

    expect(error.issues.length).toBe(2);
    expect(error.issues[0].path).toEqual(['varsPrefix']);
    expect(error.issues[0].code).toBe(ZodIssueCode.invalid_type);
  });

  it('should assign default value for "varsPrefix" if no value provided', () => {
    const result = pluginOptionsSchema.safeParse({
      theme: { tokens: {}, surfaces: {} },
    });

    expect(result.success).toBe(true);

    const data = (result as SafeParseSuccess<PluginOptions>).data;

    expect(data.varsPrefix).toBe(VARS_PREFIX);
  });

  it('should catch error if invalid "classnamesPrefix" provided', () => {
    const result = pluginOptionsSchema.safeParse({ classnamesPrefix: 5 });

    expect(result.success).toBe(false);

    const error = (result as SafeParseError<typeof result>).error;

    expect(error.issues.length).toBe(2);
    expect(error.issues[0].path).toEqual(['classnamesPrefix']);
    expect(error.issues[0].code).toBe(ZodIssueCode.invalid_type);
  });

  it('should assign default value for "classnamesPrefix" if no value provided', () => {
    const result = pluginOptionsSchema.safeParse({
      theme: { tokens: {}, surfaces: {} },
    });

    expect(result.success).toBe(true);

    const data = (result as SafeParseSuccess<PluginOptions>).data;

    expect(data.classnamesPrefix).toBe(CLASSNAMES_PREFIX);
  });

  it('should catch error if no "theme" provided', () => {
    const result = pluginOptionsSchema.safeParse({});

    expect(result.success).toBe(false);

    const error = (result as SafeParseError<typeof result>).error;

    expect(error.issues.length).toBe(1);
    expect(error.issues[0].path).toEqual(['theme']);
    expect(error.issues[0].code).toBe(ZodIssueCode.invalid_type);
  });
});
