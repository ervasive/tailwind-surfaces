import { describe, it, expect } from '@jest/globals';
import { buildProcessedSurfacesMap } from './build-processed-surfaces-map';

describe('buildProcessedSurfacesMap', () => {
  it('should return a map instance', () => {
    const result = buildProcessedSurfacesMap({}, 'prefix-');
    expect(result.success && result.data.size).toBe(0);
  });

  it('should insert items', () => {
    const result = buildProcessedSurfacesMap({ one: {}, two: {} }, 'prefix-');
    expect(result.success && result.data.size).toBe(2);
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
    expect(result.success && result.data.size).toBe(4);
  });

  it('should set correct map keys', () => {
    const result = buildProcessedSurfacesMap(
      { one: {}, two: { tokens: {}, children: { three: {} } } },
      'prefix-',
    );

    expect(result.success && result.data.get('/one')).toBeDefined();
    expect(result.success && result.data.get('/two')).toBeDefined();
    expect(result.success && result.data.get('/two/three')).toBeDefined();
  });

  it('should assign correct path value of items', () => {
    const result = buildProcessedSurfacesMap(
      { one: {}, two: { tokens: {}, children: { three: {} } } },
      'prefix-',
    );

    expect(result.success && result.data.get('/one')?.path).toEqual(['one']);
    expect(result.success && result.data.get('/two')?.path).toEqual(['two']);
    expect(result.success && result.data.get('/two/three')?.path).toEqual([
      'two',
      'three',
    ]);
  });

  it('should resolve un-prefixed "extends" value a correct absolute path', () => {
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

    expect(result.success && result.data.get('/one')?.extends).toBeUndefined();
    expect(result.success && result.data.get('/two')?.extends).toEqual('/one');
    expect(
      result.success && result.data.get('/two/three')?.extends,
    ).toBeUndefined();
    expect(result.success && result.data.get('/two/four')?.extends).toEqual(
      '/two/three',
    );
  });

  it('should assign passed absolute "extends" value', () => {
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

    expect(result.success && result.data.get('/one')?.extends).toBeUndefined();
    expect(result.success && result.data.get('/two')?.extends).toEqual('/one');
    expect(
      result.success && result.data.get('/two/three')?.extends,
    ).toBeUndefined();
    expect(result.success && result.data.get('/two/four')?.extends).toEqual(
      '/one',
    );
  });

  it('should resolve relative "extends" value a correct absolute path', () => {
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

    expect(result.success && result.data.get('/one')?.extends).toBeUndefined();
    expect(result.success && result.data.get('/two')?.extends).toEqual('/one');
    expect(
      result.success && result.data.get('/two/three')?.extends,
    ).toBeUndefined();
    expect(result.success && result.data.get('/two/four')?.extends).toEqual(
      '/one',
    );
  });

  it('should handle path resolution to the root level', () => {
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

    expect(result.success && result.data.get('/one')?.extends).toBeUndefined();
    expect(result.success && result.data.get('/two')?.extends).toEqual('/one');
    expect(
      result.success && result.data.get('/two/three')?.extends,
    ).toBeUndefined();
    expect(result.success && result.data.get('/two/four')?.extends).toEqual(
      '/one',
    );
  });

  it('should result in error if extends reference a surface at deeper level than the original surface', () => {
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

    expect(!result.success && result.error.message).toMatch(
      /invalid extend found.*\/two\/four.*\/two\/four\/five/i,
    );
  });

  it('should assign tokens to properties', () => {
    const result = buildProcessedSurfacesMap(
      {
        one: {
          'token-one': 'red',
          'token-two': ['white', 'black'],
        },
      },
      'prefix-',
    );

    expect(
      result.success &&
        result.data.get('/one')?.properties.get('--prefix-token-one'),
    ).toBe('red');
    expect(
      result.success &&
        result.data.get('/one')?.properties.get('--prefix-token-two'),
    ).toBe('white');
    expect(
      result.success &&
        result.data.get('/one')?.properties.get('--prefix-dark-token-one'),
    ).toBe('red');
    expect(
      result.success &&
        result.data.get('/one')?.properties.get('--prefix-dark-token-two'),
    ).toBe('black');
  });

  it('should assign styles to properties', () => {
    const result = buildProcessedSurfacesMap(
      {
        one: {
          tokens: {},
          styles: {
            color: 'red',
            backgroundColor: ['white', 'black'],
          },
        },
      },
      'prefix-',
    );

    expect(
      result.success && result.data.get('/one')?.properties.get('color'),
    ).toBe('red');
    expect(
      result.success &&
        result.data.get('/one')?.properties.get('backgroundColor'),
    ).toBe('white');
    expect(
      result.success &&
        result.data.get('/one')?.properties.get('--prefix-dark-prop-color'),
    ).toBe('red');
    expect(
      result.success &&
        result.data
          .get('/one')
          ?.properties.get('--prefix-dark-prop-background-color'),
    ).toBe('black');
  });
});
