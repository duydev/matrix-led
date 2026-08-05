/** Flatten newlines to a single space (FR-05 / AC-07). */
export function flattenText(text: string): string {
  return text.replace(/\r\n|\r|\n/g, ' ');
}
