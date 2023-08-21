import { z } from 'zod';
import { tokenSchema } from './token';

export const stylesSchema = z.record(tokenSchema, {
  required_error: 'styles object is required',
  invalid_type_error:
    'invalid styles, must be an object whose property values must be ' +
    'either a non-empty string, or a two-tuple of non-empty strings',
});
