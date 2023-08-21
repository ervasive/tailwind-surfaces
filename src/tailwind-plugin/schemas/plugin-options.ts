import { type ZodType, z } from 'zod';
import { CLASSNAMES_PREFIX, VARS_PREFIX } from '../../constants';
import type { PluginOptions } from '../types';
import { themeSchema } from '.';

export const pluginOptionsSchema: ZodType<PluginOptions> = z.object(
  {
    varsPrefix: z
      .string({ invalid_type_error: 'must be a non-empty string' })
      .min(3)
      .default(VARS_PREFIX),
    classnamesPrefix: z
      .string({ invalid_type_error: 'must be a non-empty string' })
      .min(3)
      .default(CLASSNAMES_PREFIX),
    theme: themeSchema,
  },
  {
    required_error: 'options must be specified',
    invalid_type_error: 'options must on object',
  },
);
