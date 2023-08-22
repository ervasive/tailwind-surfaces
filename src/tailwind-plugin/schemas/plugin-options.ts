import { type ZodType, z } from 'zod';
import { CLASSNAMES_PREFIX, VARS_PREFIX } from '../../constants';
import type { PluginOptions } from '../types';
import { themeSchema } from '.';

export const pluginOptionsSchema: ZodType<PluginOptions> = z.object(
  {
    varsPrefix: z
      .string({ invalid_type_error: 'if set must be a non-empty string' })
      .min(3)
      .default(VARS_PREFIX),
    classnamesPrefix: z
      .union([z.string().min(3), z.null()], {
        errorMap: () => ({
          message:
            'if set must be either a non-empty string or null (to disable class names prefix)',
        }),
      })
      .default(CLASSNAMES_PREFIX),
    theme: themeSchema,
  },
  {
    required_error: 'options must be specified',
    invalid_type_error: 'options must on object',
  },
);
