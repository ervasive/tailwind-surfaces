import { ZodError } from 'zod-validation-error';

export function formatSchemaErrors(error: ZodError): string {
  const message = error.issues[0].message;
  return `[tailwind-surfaces] invalid options provided: ${message}`;
}
