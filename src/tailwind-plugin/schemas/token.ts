import { ZodType, z } from 'zod';
import { Token } from '../types';

const errorMap = () => ({
  message:
    `invalid token value, must be either a non-empty string value, ` +
    `or a two-tuple of non-empty strings`,
});

const tokenValueSchema = z.string({ errorMap }).nonempty();

export const tokenSchema: ZodType<Token> = z.union(
  [
    tokenValueSchema,
    z.tuple([tokenValueSchema, tokenValueSchema], { errorMap }),
  ],
  { errorMap },
);
