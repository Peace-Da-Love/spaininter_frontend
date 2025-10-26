export function extractAfterCR(input: string | undefined | null): string {
  if (!input || typeof input !== 'string') {
    return '';
  }
  const idx = input.indexOf('&#13;');
  return idx === -1 ? '' : input.slice(idx + 5).replace(/&#13;/g, '<br>');
}