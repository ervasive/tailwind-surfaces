/**
 * Result represent the result of an operation that can either succeed or fail.
 * If the operation succeeds, its result represents a value (or non-value). If
 * it fails, its result represents an error.
 *
 * @see https://imhoff.blog/posts/using-results-in-typescript
 */
export type Result<T, E = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E };

/**
 * Utility type for converting list of strings into an object where the
 * properties key names are generated from the given list
 */
export type ObjectFromList<T extends ReadonlyArray<string>, V = string> = {
  [K in T extends ReadonlyArray<infer U> ? U : never]: V;
};

/**
 * Maps CSS property names to the Token value type
 */
export type CSSTokens = {
  [K in keyof CSSStyleDeclaration & string]?: Token;
};

/**
 * Token represents values of the generated CSS vars (custom CSS properties).
 * Token can be of type string in this case the value is going to be applied to
 * both light & dark color scheme style rules, if it is defined as a two-tuple,
 * then the value at the first index is going to be applied to the light color
 * scheme rule, and the second one to the dark color scheme rule
 */
export type Token = string | [string, string];

/**
 * Record of token name to token value
 */
export type SurfaceTokens<TokensList extends string[] = string[]> =
  ObjectFromList<TokensList, Token>;

/**
 * Theme surface
 */
export interface Surface<TokensList extends string[] = string[]> {
  /**
   * Some surfaces may represent a variation of another surface therefore it
   * does not make sense to define all tokens again. If `extends` property
   * resolves to another surface configuration, then the selectors of the
   * generated surfaces are going to be merged...
   * TODO: fix & finish description
   */
  extends?: string;

  /**
   * Token values assigned to a surface
   */
  tokens?: Partial<SurfaceTokens<TokensList>>;

  /**
   * TODO: add description
   */
  styles?: Partial<CSSTokens>;

  /**
   * TODO: add description
   */
  children?:
    | 'inherit'
    | Record<string, Surface<TokensList> | SurfaceTokens<TokensList>>;
}

/**
 * Options theme
 */
export interface Theme<TokensList extends string[] = string[]> {
  /**
   * Theme tokens
   */
  tokens: SurfaceTokens<TokensList>;

  /**
   * Default styles applied to theme root and its surfaces
   */
  styles?: Partial<CSSTokens>;

  /**
   *  Theme surfaces
   */
  surfaces: Record<string, Surface<TokensList> | SurfaceTokens<TokensList>>;
}

/**
 * Required plugin options
 */
export interface PluginOptions {
  /**
   * User defined value to use as a prefix for the generated CSS custom
   * properties. If it is not defined the default `tws-` is used.
   */
  varsPrefix?: string;

  /**
   * User defined values to use as a selectors prefix of generated tailwind css
   * component style rules.
   *
   * ```
   * theme.surfaces.base => .prefix-base { ... }
   * ```
   *
   * If it is not defined then the selectors of the style rules will be
   * generated as defined in the theme entries.
   *
   * ```
   * theme.surfaces.base => .base { ... }
   * ```
   */
  classnamesPrefix?: string;

  /**
   * User defined theme.
   *
   * Specify tokens and surface configuration...
   * TODO: write comprehensive description
   */
  theme: Theme;
}
