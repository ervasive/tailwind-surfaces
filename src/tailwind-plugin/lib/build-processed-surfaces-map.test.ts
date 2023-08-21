import { describe, it, expect } from '@jest/globals';
import { buildProcessedSurfacesMap } from './build-processed-surfaces-map';

describe('buildProcessedSurfacesMap', () => {
  it('should return map', () => {
    const result = buildProcessedSurfacesMap({}, 'prefix-');
    expect(result.ok && result.value.size).toBe(0);
  });

  it('should insert items', () => {
    const result = buildProcessedSurfacesMap({ one: {}, two: {} }, 'prefix-');
    expect(result.ok && result.value.size).toBe(2);
  });

  it('should fold nested items', () => {
    const result = buildProcessedSurfacesMap(
      {
        one: {},
        two: {
          tokens: {},
          children: { three: { tokens: {}, children: { five: {} } } },
        },
      },
      'prefix-',
    );
    expect(result.ok && result.value.size).toBe(4);
  });

  it('should set correct map keys', () => {
    const result = buildProcessedSurfacesMap(
      { one: {}, two: { tokens: {}, children: { three: {} } } },
      'prefix-',
    );

    expect(result.ok && result.value.get('/one')).toBeDefined();
    expect(result.ok && result.value.get('/two')).toBeDefined();
    expect(result.ok && result.value.get('/two/three')).toBeDefined();
  });

  it('should assign correct path value of items', () => {
    const result = buildProcessedSurfacesMap(
      { one: {}, two: { tokens: {}, children: { three: {} } } },
      'prefix-',
    );

    expect(result.ok && result.value.get('/one')?.path).toEqual(['one']);
    expect(result.ok && result.value.get('/two')?.path).toEqual(['two']);
    expect(result.ok && result.value.get('/two/three')?.path).toEqual([
      'two',
      'three',
    ]);
  });

  it('should transform unprefixed extends value to point to the absolute value at the same level', () => {
    const result = buildProcessedSurfacesMap(
      {
        one: {},
        two: {
          tokens: {},
          extends: 'one',
          children: { three: {}, four: { extends: 'three', tokens: {} } },
        },
      },
      'prefix-',
    );

    expect(result.ok && result.value.get('/one')?.extends).toBeUndefined();
    expect(result.ok && result.value.get('/two')?.extends).toEqual('/one');
    expect(
      result.ok && result.value.get('/two/three')?.extends,
    ).toBeUndefined();
    expect(result.ok && result.value.get('/two/four')?.extends).toEqual(
      '/two/three',
    );
  });

  it('should keep extends value which is defined as absolute path-like value', () => {
    const result = buildProcessedSurfacesMap(
      {
        one: {},
        two: {
          tokens: {},
          extends: '/one',
          children: { three: {}, four: { extends: '/one', tokens: {} } },
        },
      },
      'prefix-',
    );

    expect(result.ok && result.value.get('/one')?.extends).toBeUndefined();
    expect(result.ok && result.value.get('/two')?.extends).toEqual('/one');
    expect(
      result.ok && result.value.get('/two/three')?.extends,
    ).toBeUndefined();
    expect(result.ok && result.value.get('/two/four')?.extends).toEqual('/one');
  });

  it('should transform relatively defined extends value to point to the absolute value at the specified location', () => {
    const result = buildProcessedSurfacesMap(
      {
        one: {},
        two: {
          tokens: {},
          extends: 'one',
          children: { three: {}, four: { extends: '../one', tokens: {} } },
        },
      },
      'prefix-',
    );

    expect(result.ok && result.value.get('/one')?.extends).toBeUndefined();
    expect(result.ok && result.value.get('/two')?.extends).toEqual('/one');
    expect(
      result.ok && result.value.get('/two/three')?.extends,
    ).toBeUndefined();
    expect(result.ok && result.value.get('/two/four')?.extends).toEqual('/one');
  });

  it('should point to the up-most path value if relative extends goes outside "root"', () => {
    const result = buildProcessedSurfacesMap(
      {
        one: {},
        two: {
          tokens: {},
          extends: 'one',
          children: {
            three: {},
            four: { extends: '../../../../one', tokens: {} },
          },
        },
      },
      'prefix-',
    );

    expect(result.ok && result.value.get('/one')?.extends).toBeUndefined();
    expect(result.ok && result.value.get('/two')?.extends).toEqual('/one');
    expect(
      result.ok && result.value.get('/two/three')?.extends,
    ).toBeUndefined();
    expect(result.ok && result.value.get('/two/four')?.extends).toEqual('/one');
  });

  it('should result in error if any item tries to extend another item on a deeper level than the referencing item', () => {
    const result = buildProcessedSurfacesMap(
      {
        one: {},
        two: {
          tokens: {},
          extends: 'one',
          children: {
            three: {},
            four: { extends: '/two/four/five', tokens: {} },
          },
        },
      },
      'prefix-',
    );

    expect(!result.ok && result.error.message).toMatch(/something happened/i);
  });
});
