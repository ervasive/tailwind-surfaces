import { ZodError, ZodIssueCode } from 'zod';

/**
 * Format provided ZodError into a string
 *
 * @param error - instance of ZodError to format
 *
 * @returns formatted error message string
 */
export function formatSchemaErrors(error: ZodError): string {
  const messages: string[] = [];

  error.issues.forEach((iss) => {
    if (!iss.path.length) {
      messages.push('options object was not provided');
      return;
    }

    if (iss.code === ZodIssueCode.invalid_union) {
      messages.push(`${iss.path.join('.')} - ${iss.message}`);
      return;
    }

    messages.push(`${iss.path.join('.')} - ${iss.message}`);
  });

  return `[tailwind-surfaces] invalid options:\n- ${messages.join('\n- ')}`;
}
