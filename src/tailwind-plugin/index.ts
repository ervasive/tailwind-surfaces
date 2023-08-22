import * as plugin from 'tailwindcss/plugin';
import { PluginOptions } from './types';
import { ProcessedOptionsResult, processOptions } from './lib/process-options';
import { IS_DEV, IS_TEST } from '../constants';
import { resolveRootSurface } from './lib/resolve-root-surface';

let validated: ProcessedOptionsResult | undefined;

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
      if (!validated) {
        validated = processOptions(options);
      }

      if (validated.success) {
        const { surfaces, varsPrefix } = validated.data;

        surfaces.forEach((item) => {
          const rootProps: Record<string, string> = {};

          if (item.extends) {
            const rootItem = resolveRootSurface(item.extends, surfaces);

            if (rootItem) {
              rootItem.properties.forEach((value, name) => {
                rootProps[name.replace(varsPrefix, `${varsPrefix}root-`)] =
                  value;
              });
            }
          }

          addComponents({
            ['.tws-' + item.path.join(' .tws-')]: {
              ...Object.fromEntries(item.properties.entries()),
              ...rootProps,
            },
          });
        });
      } else {
        if (IS_DEV || IS_TEST) {
          console.error(validated.error.message);
          return;
        } else {
          throw validated.error;
        }
      }
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
  (options) => {
    if (!validated) {
      validated = processOptions(options);
    }
    if (validated.success) {
      const { tokens, varsPrefix } = validated.data;
      const colors: Record<string, string> = {};

      tokens.forEach((token) => {
        colors[token] = `var(--${varsPrefix}${token})`;
      });

      return {
        theme: {
          extend: {
            colors,
          },
        },
      };
    } else {
      return {};
    }
  },
);
