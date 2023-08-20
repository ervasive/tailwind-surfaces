import * as plugin from "tailwindcss/plugin";

/**
 * Tailwind surfaces
 *
 * TODO: add comprehensive description
 */
export const tailwindSurfaces = plugin.withOptions(
  /**
   * Create base styles for configuration options, theme, properties applied to
   * all `surface` selectors
   *
   * @param options - plugin options object
   */
  (options) => {
    return ({ addComponents }) => {
      addComponents({
        [`:root`]: {
          content: `"test 2222"`,
        },

        ".surface-test": {
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
