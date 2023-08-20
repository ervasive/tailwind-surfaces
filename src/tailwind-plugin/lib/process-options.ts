import { PluginOptions, Result } from '../types';

/**
 * After processing...
 * TODO: describe
 */
export type ProcessedOptionsResult = Result<{
  varsPrefix: string;
  classnamesPrefix: string;
  tokens: string[];
  surfaces: Map<string, any>;
}>;

/**
 * Validate options and process theme surfaces into a flat map so we can
 * resolve items by their path
 *
 * @param options - plugin options to validate and process
 *
 * @returns ...
 */
export function processOptions(
  options: PluginOptions,
): Result<ProcessedOptionsResult> {
  return { ok: true, value: '' };
}
