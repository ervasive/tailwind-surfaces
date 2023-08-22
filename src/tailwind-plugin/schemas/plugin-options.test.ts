import { describe, it, expect } from '@jest/globals';
import { SafeParseError, SafeParseSuccess, ZodIssueCode } from 'zod';
import { CLASSNAMES_PREFIX, VARS_PREFIX } from '../../constants';
import { PluginOptions } from '../types';
import { pluginOptionsSchema } from './plugin-options';

describe('pluginOptionsSchema', () => {
  it('should catch error if no value provided', () => {
    const result = pluginOptionsSchema.safeParse(undefined);

    expect(result.success).toBe(false);

    const error = (result as SafeParseError<typeof result>).error;

    expect(error.issues.length).toBe(1);
    expect(error.issues[0].path).toEqual([]);
    expect(error.issues[0].code).toBe(ZodIssueCode.invalid_type);
    expect(error.issues[0].message).toMatch(/options must be specified/i);
  });

  it('should catch error if invalid value type provided', () => {
    const result = pluginOptionsSchema.safeParse(5);

    expect(result.success).toBe(false);

    const error = (result as SafeParseError<typeof result>).error;

    expect(error.issues.length).toBe(1);
    expect(error.issues[0].path).toEqual([]);
    expect(error.issues[0].code).toBe(ZodIssueCode.invalid_type);
    expect(error.issues[0].message).toMatch(/options must on object/i);
  });

  it('should catch error if invalid "varsPrefix" provided', () => {
    const result = pluginOptionsSchema.safeParse({ varsPrefix: 5 });

    expect(result.success).toBe(false);

    const error = (result as SafeParseError<typeof result>).error;

    expect(error.issues.length).toBe(2);
    expect(error.issues[0].path).toEqual(['varsPrefix']);
    expect(error.issues[0].code).toBe(ZodIssueCode.invalid_type);
    expect(error.issues[0].message).toMatch(/must be a non-empty string/);
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
    expect(error.issues[0].code).toBe(ZodIssueCode.invalid_union);
    expect(error.issues[0].message).toMatch(
      /if set must be either a non-empty string or null/i,
    );
  });

  it('should assign null value for "classnamesPrefix"', () => {
    const result = pluginOptionsSchema.safeParse({
      classnamesPrefix: null,
      theme: { tokens: {}, surfaces: {} },
    });

    expect(result.success).toBe(true);

    const data = (result as SafeParseSuccess<PluginOptions>).data;

    expect(data.classnamesPrefix).toBe(null);
  });

  it('should assign default value for "classnamesPrefix" if no value provided', () => {
    const result = pluginOptionsSchema.safeParse({
      theme: { tokens: {}, surfaces: {} },
    });

    expect(result.success).toBe(true);

    const data = (result as SafeParseSuccess<PluginOptions>).data;

    expect(data.classnamesPrefix).toBe(CLASSNAMES_PREFIX);
  });

  it('should return validated input', () => {
    const input = {
      varsPrefix: 'vars-prefix-value',
      classnamesPrefix: 'classnames-prefix-value',
      theme: {
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
      },
    };
    const result = pluginOptionsSchema.safeParse(input);

    expect(result.success).toBe(true);

    const data = (result as SafeParseSuccess<PluginOptions>).data;

    expect(data).toEqual(input);
  });
});
