import { describe, expect, it } from '@jest/globals';
import { processOptions } from './process-options';

describe('processOptions', () => {
  it('should return error if no options provided', () => {
    const result = processOptions(undefined as any);

    expect(!result.ok && result.error).toMatch(/options object is missing/i);
  });
});
