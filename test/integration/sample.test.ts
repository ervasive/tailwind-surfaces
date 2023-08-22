import { describe, it, expect } from '@jest/globals';
import { run } from '../helpers';
// import { PluginOptions } from '../../src';

describe('first', () => {
  it('should', async () => {
    // try {
    const result = await run({
      contents:
        '<div class="tws-variant text-strong border border-[purple]">content</div>',
      options: {
        theme: {
          tokens: {
            surface: ['blue !important', 'green !important'],
            strong: 'orange',
          },
          surfaces: {
            base: { surface: 'red', strong: 'green' },
            variant: {
              extends: 'base',
              tokens: { surface: 'orange', strong: 'white' },
            },
          },
        },
      },
      testId: 'sample',
      layers: ['components', 'utilities'],
    });

    expect(result.css).toBe('hi');
    // } catch (e) {
    //   expect(e).toMatch(/asd/);
    // }
  });
});
