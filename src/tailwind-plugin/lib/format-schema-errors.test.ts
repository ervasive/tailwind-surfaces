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

  it('should include error message for invalid varsPrefix', () => {
    try {
      pluginOptionsSchema.parse({
        varsPrefix: 5,
      });
    } catch (e) {
      expect(formatSchemaErrors(e as ZodError)).toMatch(
        /varsPrefix - if defined, must be a non-empty string/i,
      );
    }
  });

  it('should include error message for invalid classnamesPrefix', () => {
    try {
      pluginOptionsSchema.parse({
        classnamesPrefix: 5,
      });
    } catch (e) {
      expect(formatSchemaErrors(e as ZodError)).toMatch(
        /classnamesPrefix - if defined, must be a non-empty string/i,
      );
    }
  });

  it('should include error message for missing theme', () => {
    try {
      pluginOptionsSchema.parse({});
    } catch (e) {
      expect(formatSchemaErrors(e as ZodError)).toMatch(/theme - required/i);
    }
  });

  it('should include error message for invalid theme', () => {
    try {
      pluginOptionsSchema.parse({ theme: 5 });
    } catch (e) {
      expect(formatSchemaErrors(e as ZodError)).toMatch(
        /theme - must be an object describing tokens, styles & surfaces/i,
      );
    }
  });

  it('should include error message for missing theme.tokens', () => {
    try {
      pluginOptionsSchema.parse({ theme: {} });
    } catch (e) {
      expect(formatSchemaErrors(e as ZodError)).toMatch(
        /theme.tokens - required/i,
      );
    }
  });

  it('should include error message for missing theme.styles', () => {
    try {
      pluginOptionsSchema.parse({ theme: {} });
    } catch (e) {
      expect(formatSchemaErrors(e as ZodError)).toMatch(
        /theme.styles - required/i,
      );
    }
  });

  it('should include error message for missing theme.surfaces', () => {
    try {
      pluginOptionsSchema.parse({ theme: {} });
    } catch (e) {
      expect(formatSchemaErrors(e as ZodError)).toMatch(
        /theme.surfaces - required/i,
      );
    }
  });

  it('should include error message for invalid theme.tokens', () => {
    try {
      pluginOptionsSchema.parse({ theme: { tokens: 5 } });
    } catch (e) {
      expect(formatSchemaErrors(e as ZodError)).toMatch(
        /theme.tokens - invalid type/i,
      );
    }
  });

  it('should include error message for invalid theme.styles', () => {
    try {
      pluginOptionsSchema.parse({
        theme: { styles: 5 },
      });
    } catch (e) {
      expect(formatSchemaErrors(e as ZodError)).toMatch(
        /theme.styles - invalid type/i,
      );
    }
  });

  it('should include error message for invalid theme.surfaces', () => {
    try {
      pluginOptionsSchema.parse({
        theme: { surfaces: 5 },
      });
    } catch (e) {
      expect(formatSchemaErrors(e as ZodError)).toMatch(
        /theme.surfaces - invalid type/i,
      );
    }
  });

  it('should include error message for invalid theme.tokens.item', () => {
    try {
      pluginOptionsSchema.parse({
        theme: { tokens: { token: 5 } },
      });
    } catch (e) {
      expect(formatSchemaErrors(e as ZodError)).toMatch(
        /theme.tokens.token - invalid token value/i,
      );
    }
  });

  it('should include error message for invalid theme.styles.item', () => {
    try {
      pluginOptionsSchema.parse({
        theme: { styles: { color: 5 } },
      });
    } catch (e) {
      expect(formatSchemaErrors(e as ZodError)).toMatch(
        /theme.styles.color - invalid token value/i,
      );
    }
  });

  it('should include error message for invalid theme.surfaces.item', () => {
    try {
      pluginOptionsSchema.parse({
        theme: {
          surfaces: { example: 5 },
        },
      });
    } catch (e) {
      expect(formatSchemaErrors(e as ZodError)).toMatch(
        /theme.surfaces.example - invalid surface/i,
      );
    }
  });

  it('should include error messages for multiple issues', () => {
    try {
      pluginOptionsSchema.parse({
        theme: {
          tokens: {},
          styles: {},
        },
      });
    } catch (e) {
      expect(formatSchemaErrors(e as ZodError)).toMatch(/theme.tokens/);
      expect(formatSchemaErrors(e as ZodError)).toMatch(/theme.styles/);
      expect(formatSchemaErrors(e as ZodError)).toMatch(/theme.surfaces/);
    }
  });
});
