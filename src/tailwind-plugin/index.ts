import * as plugin from 'tailwindcss/plugin';
import { PluginOptions } from './types';

/**
 * Tailwind surfaces
 *
 * TODO: add comprehensive description
 */
export const tailwindSurfaces = plugin.withOptions<PluginOptions>(
  /**
   * Create base styles for configuration options, theme, properties applied to
   * all `surface` selectors
   *
   * @param options - plugin options object
   */
  (options) => {
    return ({ addComponents }) => {
      console.log(options);
      addComponents({
        [`:root`]: {
          content: `"test 2222"`,
        },

        '.surface-test': {
          content: `"surface-test"`,
        },
      });
    };
  },
  /**
   * We want to extend theme object and add all user defined tokens & `parent`
   * tokens
   *
   * @param options - plugin options object
   *
   * @returns Extended theme
   */
  () => {
    return {};
  },
);
