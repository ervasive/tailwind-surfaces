import { PluginOptions, ProcessedSurface, Result } from '../types';
import { pluginOptionsSchema } from '../schemas';
import { formatSchemaErrors } from './format-schema-errors';
import { buildProcessedSurfacesMap } from './build-processed-surfaces-map';

/**
 * After processing...
 * TODO: describe
 */
export type ProcessedOptionsResult = Result<{
  varsPrefix: string;
  classnamesPrefix?: string | null;
  tokens: string[];
  surfaces: Map<string, ProcessedSurface>;
}>;

/**
 * Validate options and process theme surfaces into a flat map so we can
 * resolve items by their path
 *
 * @param options - plugin options to validate and process
 *
 * @returns ...
 */
export function processOptions(options: PluginOptions): ProcessedOptionsResult {
  const optionsResult = pluginOptionsSchema.safeParse(options);

  if (!optionsResult.success) {
    return {
      success: false,
      error: new Error(formatSchemaErrors(optionsResult.error)),
    };
  }

  const { varsPrefix, classnamesPrefix, theme } = optionsResult.data;
  const surfacesResult = buildProcessedSurfacesMap(theme.surfaces, varsPrefix!);

  if (!surfacesResult.success) {
    return {
      success: false,
      error: surfacesResult.error,
    };
  }

  const result: ProcessedOptionsResult = {
    success: true,
    data: {
      varsPrefix: varsPrefix!,
      classnamesPrefix: classnamesPrefix,
      tokens: Object.keys(theme.tokens),
      surfaces: surfacesResult.success ? surfacesResult.data : new Map(),
    },
  };

  return result;
}
