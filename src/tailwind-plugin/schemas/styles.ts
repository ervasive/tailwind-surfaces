import { z } from 'zod';
import { tokenSchema } from './token';

export const stylesSchema = z.record(tokenSchema);
