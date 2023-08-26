import { describe, it, expect } from '@jest/globals';
import { SafeParseError, SafeParseSuccess, ZodIssueCode } from 'zod';
import {
  DEFAULT_CLASSNAMES_PREFIX,
  DEFAULT_VARS_PREFIX,
} from '../../shared/constants';
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
    expect(error.issues[0].message).toMatch(/options must an object/i);
  });

  it('should catch error if invalid "varsPrefix" provided', () => {
    const result = pluginOptionsSchema.safeParse({ varsPrefix: 5 });

    expect(result.success).toBe(false);

    const error = (result as SafeParseError<typeof result>).error;

    expect(error.issues.length).toBe(2);
    expect(error.issues[0].path).toEqual(['varsPrefix']);
    expect(error.issues[0].code).toBe(ZodIssueCode.invalid_type);
    expect(error.issues[0].message).toMatch(
      /if defined, must be a non-empty string/,
    );
  });

  it('should assign default value for "varsPrefix" if no value provided', () => {
    const result = pluginOptionsSchema.safeParse({
      theme: {
        tokens: { token: 'value' },
        styles: {
          backgroundColor: 'value',
          borderColor: 'value',
          color: 'value',
        },
        surfaces: {},
      },
    });

    expect(result.success).toBe(true);

    const data = (result as SafeParseSuccess<PluginOptions>).data;

    expect(data.varsPrefix).toBe(DEFAULT_VARS_PREFIX);
  });

  it('should catch error if invalid "classnamesPrefix" provided', () => {
    const result = pluginOptionsSchema.safeParse({ classnamesPrefix: 5 });

    expect(result.success).toBe(false);

    const error = (result as SafeParseError<typeof result>).error;

    expect(error.issues.length).toBe(2);
    expect(error.issues[0].path).toEqual(['classnamesPrefix']);
    expect(error.issues[0].code).toBe(ZodIssueCode.invalid_type);
    expect(error.issues[0].message).toMatch(
      /if defined, must be a non-empty string/,
    );
  });

  it('should assign default value for "classnamesPrefix" if no value provided', () => {
    const result = pluginOptionsSchema.safeParse({
      theme: {
        tokens: { token: 'value' },
        styles: {
          backgroundColor: 'value',
          borderColor: 'value',
          color: 'value',
        },
        surfaces: {},
      },
    });

    expect(result.success).toBe(true);

    const data = (result as SafeParseSuccess<PluginOptions>).data;

    expect(data.classnamesPrefix).toBe(DEFAULT_CLASSNAMES_PREFIX);
  });

  it('should catch error if no "theme" provided', () => {
    const result = pluginOptionsSchema.safeParse({});

    expect(result.success).toBe(false);

    const error = (result as SafeParseError<typeof result>).error;

    expect(error.issues.length).toBe(1);
    expect(error.issues[0].path).toEqual(['theme']);
    expect(error.issues[0].code).toBe(ZodIssueCode.invalid_type);
    expect(error.issues[0].message).toMatch(/required/i);
  });

  it('should catch error if invalid "theme" provided', () => {
    const result = pluginOptionsSchema.safeParse({ theme: 5 });

    expect(result.success).toBe(false);

    const error = (result as SafeParseError<typeof result>).error;

    expect(error.issues.length).toBe(1);
    expect(error.issues[0].path).toEqual(['theme']);
    expect(error.issues[0].code).toBe(ZodIssueCode.invalid_type);
    expect(error.issues[0].message).toMatch(
      /must be an object describing tokens, styles & surfaces/,
    );
  });

  it('should catch error if no "theme.tokens" provided', () => {
    const result = pluginOptionsSchema.safeParse({
      theme: {
        styles: {
          backgroundColor: 'value',
          borderColor: 'value',
          color: 'value',
        },
        surfaces: {},
      },
    });

    expect(result.success).toBe(false);

    const error = (result as SafeParseError<typeof result>).error;

    expect(error.issues.length).toBe(1);
    expect(error.issues[0].path).toEqual(['theme', 'tokens']);
    expect(error.issues[0].code).toBe(ZodIssueCode.invalid_type);
    expect(error.issues[0].message).toMatch(/required/i);
  });

  it('should catch error if invalid "theme.tokens" provided', () => {
    const result = pluginOptionsSchema.safeParse({
      theme: {
        styles: {
          backgroundColor: 'value',
          borderColor: 'value',
          color: 'value',
        },
        surfaces: {},
        tokens: 5,
      },
    });

    expect(result.success).toBe(false);

    const error = (result as SafeParseError<typeof result>).error;

    expect(error.issues.length).toBe(1);
    expect(error.issues[0].path).toEqual(['theme', 'tokens']);
    expect(error.issues[0].code).toBe(ZodIssueCode.invalid_type);
    expect(error.issues[0].message).toMatch(/invalid type/);
  });

  it('should catch error if empty "theme.tokens" provided', () => {
    const result = pluginOptionsSchema.safeParse({
      theme: {
        styles: {
          backgroundColor: 'value',
          borderColor: 'value',
          color: 'value',
        },
        surfaces: {},
        tokens: {},
      },
    });

    expect(result.success).toBe(false);

    const error = (result as SafeParseError<typeof result>).error;

    expect(error.issues.length).toBe(1);
    expect(error.issues[0].path).toEqual(['theme', 'tokens']);
    expect(error.issues[0].code).toBe(ZodIssueCode.custom);
    expect(error.issues[0].message).toMatch(/must specify at least one token/);
  });

  it('should catch error if invalid "theme.tokens.item" provided', () => {
    const result = pluginOptionsSchema.safeParse({
      theme: {
        styles: {
          backgroundColor: 'value',
          borderColor: 'value',
          color: 'value',
        },
        surfaces: {},
        tokens: { token: 5 },
      },
    });

    expect(result.success).toBe(false);

    const error = (result as SafeParseError<typeof result>).error;

    expect(error.issues.length).toBe(1);
    expect(error.issues[0].path).toEqual(['theme', 'tokens', 'token']);
    expect(error.issues[0].code).toBe(ZodIssueCode.invalid_union);
    expect(error.issues[0].message).toMatch(/invalid token value/);
  });

  it('should catch error if no "theme.styles" provided', () => {
    const result = pluginOptionsSchema.safeParse({
      theme: { tokens: { token: 'value' }, surfaces: {} },
    });

    expect(result.success).toBe(false);

    const error = (result as SafeParseError<typeof result>).error;

    expect(error.issues.length).toBe(1);
    expect(error.issues[0].path).toEqual(['theme', 'styles']);
    expect(error.issues[0].code).toBe(ZodIssueCode.invalid_type);
    expect(error.issues[0].message).toMatch(/required/i);
  });

  it('should catch error if invalid "theme.styles" provided', () => {
    const result = pluginOptionsSchema.safeParse({
      theme: { styles: 5, surfaces: {}, tokens: { token: 'value' } },
    });

    expect(result.success).toBe(false);

    const error = (result as SafeParseError<typeof result>).error;

    expect(error.issues.length).toBe(1);
    expect(error.issues[0].path).toEqual(['theme', 'styles']);
    expect(error.issues[0].code).toBe(ZodIssueCode.invalid_type);
    expect(error.issues[0].message).toMatch(/invalid type/);
  });

  it('should catch error if any of required "theme.styles" are not provided', () => {
    [
      {
        backgroundColor: 'value',
        borderColor: 'value',
      },
      {
        backgroundColor: 'value',
        color: 'value',
      },
      {
        borderColor: 'value',
        color: 'value',
      },
    ].forEach((comb) => {
      const result = pluginOptionsSchema.safeParse({
        theme: {
          styles: comb,
          surfaces: {},
          tokens: { token: 'value' },
        },
      });

      expect(result.success).toBe(false);

      const error = (result as SafeParseError<typeof result>).error;

      expect(error.issues.length).toBe(1);
      expect(error.issues[0].path).toEqual(['theme', 'styles']);
      expect(error.issues[0].code).toBe(ZodIssueCode.custom);
      expect(error.issues[0].message).toMatch(/missing required properties/);
    });
  });

  it('should catch error if invalid "theme.styles.item" provided', () => {
    const result = pluginOptionsSchema.safeParse({
      theme: {
        styles: {
          backgroundColor: 'value',
          borderColor: 'value',
          color: 'value',
          fill: 5,
        },
        surfaces: {},
        tokens: { token: 'value' },
      },
    });

    expect(result.success).toBe(false);

    const error = (result as SafeParseError<typeof result>).error;

    expect(error.issues.length).toBe(1);
    expect(error.issues[0].path).toEqual(['theme', 'styles', 'fill']);
    expect(error.issues[0].code).toBe(ZodIssueCode.invalid_union);
    expect(error.issues[0].message).toMatch(/invalid token value/);
  });

  it('should catch error if no "theme.surfaces" provided', () => {
    const result = pluginOptionsSchema.safeParse({
      theme: {
        tokens: { token: 'value' },
        styles: {
          backgroundColor: 'value',
          borderColor: 'value',
          color: 'value',
        },
      },
    });

    expect(result.success).toBe(false);

    const error = (result as SafeParseError<typeof result>).error;

    expect(error.issues.length).toBe(1);
    expect(error.issues[0].path).toEqual(['theme', 'surfaces']);
    expect(error.issues[0].code).toBe(ZodIssueCode.invalid_type);
    expect(error.issues[0].message).toMatch(/required/i);
  });

  it('should catch error if invalid "theme.surfaces" provided', () => {
    const result = pluginOptionsSchema.safeParse({
      theme: {
        styles: {
          backgroundColor: 'value',
          borderColor: 'value',
          color: 'value',
        },
        tokens: { token: 'value' },
        surfaces: 5,
      },
    });

    expect(result.success).toBe(false);

    const error = (result as SafeParseError<typeof result>).error;

    expect(error.issues.length).toBe(1);
    expect(error.issues[0].path).toEqual(['theme', 'surfaces']);
    expect(error.issues[0].code).toBe(ZodIssueCode.invalid_type);
    expect(error.issues[0].message).toMatch(/invalid type/);
  });

  it('should catch error if invalid "theme.surfaces.item" provided', () => {
    const result = pluginOptionsSchema.safeParse({
      theme: {
        styles: {
          backgroundColor: 'value',
          borderColor: 'value',
          color: 'value',
        },
        tokens: { token: 'value' },
        surfaces: {
          name: 5,
        },
      },
    });

    expect(result.success).toBe(false);

    const error = (result as SafeParseError<typeof result>).error;

    expect(error.issues.length).toBe(1);
    expect(error.issues[0].path).toEqual(['theme', 'surfaces', 'name']);
    expect(error.issues[0].code).toBe(ZodIssueCode.invalid_union);
    expect(error.issues[0].message).toMatch(/invalid surface/);
  });

  it('should return validated input', () => {
    const input = {
      varsPrefix: 'vars-prefix-value',
      classnamesPrefix: 'classnames-prefix-value',
      theme: {
        tokens: {
          one: 'one-val',
        },
        styles: {
          backgroundColor: 'value',
          borderColor: 'value',
          color: 'value',
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
