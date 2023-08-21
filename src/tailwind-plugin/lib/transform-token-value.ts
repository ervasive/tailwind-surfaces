/**
 * Transform value from token
 *
 * @param value - value to transform
 * @param prefix - prefix value for CSS custom properties from the plugin options
 *
 * @returns transformed value
 */
export function transformTokenValue(value: string, prefix: string): string {
  const trimmed = value.trim();

  if (trimmed.startsWith('colors.')) {
    return `theme(${trimmed})`;
  }

  if (trimmed.startsWith('var(')) {
    return `var(--${prefix}${trimmed.slice(4, trimmed.length - 1)})`;
  }

  return trimmed;
}
