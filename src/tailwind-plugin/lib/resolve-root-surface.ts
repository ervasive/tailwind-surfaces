import { ProcessedSurface } from '../types';
import { SurfacesMap } from './build-processed-surfaces-map';

/**
 *
 * @param path
 * @param source
 * @returns
 */
export function resolveRootSurface(
  path: string,
  source: SurfacesMap,
): ProcessedSurface | undefined {
  const item = source.get(path);

  if (!item) return;

  return item.extends ? resolveRootSurface(item.extends, source) : item;
}
