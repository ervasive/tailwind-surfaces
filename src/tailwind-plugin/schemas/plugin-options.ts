import { type ZodType, z, ZodTypeDef } from 'zod';
import {
  DEFAULT_CLASSNAMES_PREFIX,
  DEFAULT_VARS_PREFIX,
} from '../../shared/constants';
import type { PluginOptions } from '../types';
import { tokenSchema } from './token';
import { surfaceSchema } from './surface';

const prefixErrorMessage =
  'if defined, must be a non-empty string (3 characters min to minimize namings clashes)';

export const pluginOptionsSchema: ZodType<
  Required<PluginOptions>,
  ZodTypeDef,
  PluginOptions
> = z.object(
  {
    varsPrefix: z
      .string({ invalid_type_error: prefixErrorMessage })
      .min(3)
      .default(DEFAULT_VARS_PREFIX),
    classnamesPrefix: z
      .string({ invalid_type_error: prefixErrorMessage })
      .min(3)
      .default(DEFAULT_CLASSNAMES_PREFIX),
    theme: z.object(
      {
        tokens: z
          .record(tokenSchema, {
            invalid_type_error:
              'invalid type, make sure it is an object with token names ' +
              'as keys mapped to a value of type Token which may be either a ' +
              'non-empty string or a two-tuple of non-empty strings',
          })
          .refine((tokens) => Object.keys(tokens).length >= 1, {
            message: 'must specify at least one token',
          }),
        styles: z
          .record(tokenSchema, {
            invalid_type_error:
              'invalid type, make sure it is an object with CSS propety ' +
              'names as keys mapped to a value of type Token which may be ' +
              'either a non-empty string or a two-tuple of non-empty strings',
          })
          .refine(
            (styles) => {
              const keys = Object.keys(styles);

              const allRequiredStylesPresent = [
                ['background-color', 'backgroundColor'],
                ['border-color', 'borderColor'],
                ['color'],
              ].every((items) => items.some((item) => keys.includes(item)));

              return allRequiredStylesPresent;
            },
            {
              message:
                'missing required properties, values for "background-color", ' +
                '"border-color" and "color" must be specified',
            },
          ),
        surfaces: z.record(
          z.union([z.record(tokenSchema), surfaceSchema], {
            errorMap: () => ({
              // TODO: add docs URL
              message:
                'invalid surface. Can be one of two variants, either a flat ' +
                'object, specifying tokens and their values, or (for more ' +
                'advanced cases) an object representing Surface type',
            }),
          }),
          {
            // TODO: add docs URL
            invalid_type_error:
              'invalid type, make sure it is an object where each property ' +
              'maps to either a flat object, specifying tokens and their ' +
              'values, or (for more advanced cases) an object representing ' +
              'Surface type',
          },
        ),
      },
      {
        // TODO: add docs URL
        invalid_type_error:
          'must be an object describing tokens, styles & surfaces',
      },
    ),
  },
  {
    required_error: 'options must be specified',
    invalid_type_error: 'options must an object',
  },
);
