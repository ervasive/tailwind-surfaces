import { describe, it, expect } from '@jest/globals';
import { resolveRootSurface } from './resolve-root-surface';
import { SurfacesMap } from './build-processed-surfaces-map';

describe('resolveRootSurface', () => {
  it('should return undefined if no item found', () => {
    const source: SurfacesMap = new Map();

    source.set('/one', { path: ['one'], properties: new Map() });
    expect(resolveRootSurface('/two', source)).toBeUndefined();
  });

  it('should return found item', () => {
    const source: SurfacesMap = new Map();

    source.set('/one', { path: ['one'], properties: new Map() });
    expect(resolveRootSurface('/one', source)).toBeDefined();
  });

  it('should resolve root item', () => {
    const source: SurfacesMap = new Map();

    source.set('/one', { path: ['one'], properties: new Map() });
    source.set('/two', {
      path: ['two'],
      properties: new Map(),
      extends: '/one',
    });
    source.set('/three', {
      path: ['three'],
      properties: new Map(),
      extends: '/two',
    });
    expect(resolveRootSurface('/three', source)).toBeDefined();
  });
});
