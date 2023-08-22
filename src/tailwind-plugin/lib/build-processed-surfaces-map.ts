import { join, isAbsolute, sep } from 'path';
import { ProcessedSurface, Result, Surface, SurfaceTokens } from '../types';
import { expandTokenValue } from './expand-token-value';
import { isSurface } from './is-surface';

export type SurfacesMap = Map<string, ProcessedSurface>;

/**
 * Build flat map of processed surfaces recursively
 *
 * @param items
 * @param path
 * @param acc
 *
 * @returns
 */
export function buildProcessedSurfacesMap(
  items: Record<string, Surface | SurfaceTokens>,
  prefix: string,
  path: string[] = [],
  acc: SurfacesMap = new Map(),
): Result<SurfacesMap> {
  let error: Error | undefined;

  Object.entries(items).forEach(([name, item]) => {
    if (error) return;

    const entryPath = [...path, name];
    const entryPathString = `/${entryPath.join('/')}`;
    const entry: ProcessedSurface = {
      path: entryPath,
      properties: new Map(),
    };

    // converting tokens into surface properties
    Object.entries(isSurface(item) ? item.tokens : item).forEach(
      ([token, value]) => {
        if (!value) return;

        const { light, dark } = expandTokenValue(value, prefix);

        entry.properties.set(`--${prefix}${token}`, light);
        entry.properties.set(`--${prefix}dark-${token}`, dark);
      },
    );

    if (isSurface(item)) {
      // converting styles into surface properties
      Object.entries(item.styles || {}).forEach(([prop, value]) => {
        const { light, dark } = expandTokenValue(value, prefix);

        entry.properties.set(prop, light);

        // transform camelCase named properties to correct CSS props
        entry.properties.set(
          `--${prefix}dark-prop-${prop
            .split(/(?=[A-Z])/)
            .map((i) => i.toLowerCase())
            .join('-')}`,
          dark,
        );
      });

      if (item.extends) {
        const absoluteExtends = isAbsolute(item.extends)
          ? item.extends
          : join(entryPathString, '..', item.extends).replace(sep, '/');

        if (
          absoluteExtends.split('/').length > entryPathString.split('/').length
        ) {
          error = new Error(
            `Invalid extend found at path: ${entryPathString}. Surface may ` +
              `reference other surfaces only at the same level or higher. ` +
              `Invalid extend resolves to: ${absoluteExtends}`,
          );
        } else {
          entry.extends = absoluteExtends;
        }
      }
    }

    acc.set(entryPathString, entry);

    if (
      item.children &&
      !Array.isArray(item.children) &&
      typeof item.children === 'object'
    ) {
      const result = buildProcessedSurfacesMap(
        item.children,
        prefix,
        entryPath,
        acc,
      );

      if (!result.success) {
        error = result.error;
      }
    }
  });

  return error ? { success: false, error } : { success: true, data: acc };
}
