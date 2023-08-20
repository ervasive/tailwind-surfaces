import { type ZodType, z } from 'zod';
import { CLASSNAMES_PREFIX, VARS_PREFIX } from '../../constants';
import { themeSchema } from '.';
import type { PluginOptions } from '../types';

export const pluginOptionsSchema: ZodType<PluginOptions> = z.object({
  varsPrefix: z.string().default(VARS_PREFIX),
  classnamesPrefix: z.string().default(CLASSNAMES_PREFIX),
  theme: themeSchema,
});
