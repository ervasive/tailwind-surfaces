/**
 * Result represent the result of an operation that can either succeed or fail.
 * If the operation succeeds, its result represents a value (or non-value). If
 * it fails, its result represents an error.
 *
 * @see https://imhoff.blog/posts/using-results-in-typescript
 */
export type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

/**
 * TODO: add description
 */
export interface StyleConfig {
  varsPrefix: string;
  classnamesPrefix: string;
}
