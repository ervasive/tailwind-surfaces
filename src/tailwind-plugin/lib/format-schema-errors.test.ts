import { describe, it, expect } from '@jest/globals';
import { ZodError } from 'zod';
import { formatSchemaErrors } from './format-schema-errors';
import { pluginOptionsSchema } from '../schemas';

describe('formatSchemaErrors', () => {
  it('should return correct error message on missing options object', () => {
    try {
      pluginOptionsSchema.parse(undefined);
    } catch (e) {
      expect(formatSchemaErrors(e as ZodError)).toMatch(
        /options object was not provided/i,
      );
    }
  });

  it('should return correct error message for invalid varsPrefix', () => {
    try {
      pluginOptionsSchema.parse({
        varsPrefix: 5,
        theme: { tokens: {}, surfaces: {} },
      });
    } catch (e) {
      expect(formatSchemaErrors(e as ZodError)).toMatch(
        /varsPrefix - if set must be a non-empty string/i,
      );
    }
  });

  it('should return correct error message for invalid classnamesPrefix', () => {
    try {
      pluginOptionsSchema.parse({
        classnamesPrefix: 5,
        theme: { tokens: {}, surfaces: {} },
      });
    } catch (e) {
      expect(formatSchemaErrors(e as ZodError)).toMatch(
        /classnamesPrefix - if set must be either a non-empty string or null/i,
      );
    }
  });

  it('should return correct error message for missing theme', () => {
    try {
      pluginOptionsSchema.parse({});
    } catch (e) {
      expect(formatSchemaErrors(e as ZodError)).toMatch(
        /theme - theme is required/i,
      );
    }
  });

  it('should return correct error message for missing theme.tokens', () => {
    try {
      pluginOptionsSchema.parse({ theme: { surfaces: {} } });
    } catch (e) {
      expect(formatSchemaErrors(e as ZodError)).toMatch(
        /heme.tokens - tokens object is required/i,
      );
    }
  });

  it('should return correct error message for invalid theme.tokens', () => {
    try {
      pluginOptionsSchema.parse({ theme: { tokens: [], surfaces: {} } });
    } catch (e) {
      expect(formatSchemaErrors(e as ZodError)).toMatch(
        /theme.tokens - invalid tokens, must be an object/i,
      );
    }
  });

  it('should return error message for missing theme.surfaces', () => {
    try {
      pluginOptionsSchema.parse({ theme: { tokens: {} } });
    } catch (e) {
      expect(formatSchemaErrors(e as ZodError)).toMatch(
        /theme must define surfaces object/i,
      );
    }
  });

  it('should return error message for invalid theme.surfaces', () => {
    try {
      pluginOptionsSchema.parse({ theme: { tokens: {}, surfaces: [] } });
    } catch (e) {
      expect(formatSchemaErrors(e as ZodError)).toMatch(
        /theme.surfaces - invalid surfaces value/i,
      );
    }
  });

  it('should return error message for invalid theme.styles', () => {
    try {
      pluginOptionsSchema.parse({
        theme: { tokens: {}, surfaces: {}, styles: [] },
      });
    } catch (e) {
      expect(formatSchemaErrors(e as ZodError)).toMatch(
        /theme.styles - invalid styles, must be an object/i,
      );
    }
  });

  it('should return error message for invalid theme.tokens item', () => {
    try {
      pluginOptionsSchema.parse({
        theme: { tokens: { token: 5 }, surfaces: {} },
      });
    } catch (e) {
      expect(formatSchemaErrors(e as ZodError)).toMatch(
        /theme.tokens.token - invalid token value/i,
      );
    }
  });

  it('should return error message for invalid theme.styles item', () => {
    try {
      pluginOptionsSchema.parse({
        theme: { styles: { color: 5 }, tokens: {}, surfaces: {} },
      });
    } catch (e) {
      expect(formatSchemaErrors(e as ZodError)).toMatch(
        /theme.styles.color - invalid token value/i,
      );
    }
  });

  it('should return error message for invalid theme.tokens item', () => {
    try {
      pluginOptionsSchema.parse({
        theme: {
          tokens: {},
          surfaces: { example: { hello: { tokens: { test: 5 } } } },
        },
      });
    } catch (e) {
      expect(formatSchemaErrors(e as ZodError)).toMatch(
        /theme.surfaces.example.hello - invalid token value/i,
      );
    }
  });
});
