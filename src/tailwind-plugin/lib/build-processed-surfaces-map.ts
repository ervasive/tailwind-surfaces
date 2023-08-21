import { join, isAbsolute } from 'path';
import { ProcessedSurface, Result, Surface, SurfaceTokens } from '../types';
import { expandTokenValue } from './expand-token-value';
import { isSurface } from './is-surface';

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
  acc: Map<string, ProcessedSurface> = new Map(),
): Result<Map<string, ProcessedSurface>> {
  let error: Error | undefined;

  Object.entries(items).forEach(([name, item]) => {
    if (error) return;

    const entryPath = [...path, name];
    const entry: ProcessedSurface = {
      path: entryPath,
      properties: { light: new Map(), dark: new Map() },
    };
    const important = isSurface(item) ? item.children === 'inherit' : false;

    // converting tokens into surface own properties
    Object.entries(isSurface(item) ? item.tokens : item).forEach(
      ([token, value]) => {
        if (!value) return;

        const { light, dark } = expandTokenValue(value, prefix);

        entry.properties.light.set(
          `--${prefix}${token}`,
          light + important ? ' !important' : '',
        );
        entry.properties.dark.set(
          `--${prefix}dark-${token}`,
          dark + important ? ' !important' : '',
        );
      },
    );

    if (isSurface(item)) {
      Object.entries(item.styles || {}).forEach(([prop, value]) => {
        const { light, dark } = expandTokenValue(value, prefix);

        entry.properties.light.set(prop, light);
        entry.properties.dark.set(`--${prefix}dark-prop-${prop}`, dark);
      });

      if (item.extends) {
        const absolute = isAbsolute(item.extends)
          ? item.extends
          : join(`/${entryPath.join('/')}`, '..', item.extends);

        if (absolute.split('/').length > entryPath.length) {
          error = new Error(
            `Surface ${entryPath.join(
              '/',
            )} is trying to extend another surface deeeper... which is prohibited ${entryPath} ${absolute.split(
              '/',
            )}`,
          );
        } else {
          entry.extends = absolute;
        }
      }

      if (item.children && typeof item.children === 'object') {
        const result = buildProcessedSurfacesMap(
          item.children,
          prefix,
          entryPath,
          acc,
        );

        if (!result.ok) {
          error = result.error;
        }
      }
    }

    acc.set(`/${entryPath.join('/')}`, entry);
  });

  return error ? { ok: false, error } : { ok: true, value: acc };
}
