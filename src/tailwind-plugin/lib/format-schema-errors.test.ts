import { describe, it, expect } from '@jest/globals';
import { formatSchemaErrors } from './format-schema-errors';
import { ZodError } from 'zod';

describe('formatSchemaErrors', () => {
  it('should', () => {
    const result = formatSchemaErrors(
      new ZodError([{ code: 'custom', path: [], message: 'TBD' }]),
    );

    expect(result).toBe('TBD');
  });
});
