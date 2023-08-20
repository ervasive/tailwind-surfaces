import { ZodType, z } from 'zod';
import { Token } from '../types';

export const tokenSchema: ZodType<Token> = z.union([
  z.string().nonempty(),
  z.tuple([z.string().nonempty(), z.string().nonempty()]),
]);
