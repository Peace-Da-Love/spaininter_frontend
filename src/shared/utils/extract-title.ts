export function extractBeforeCR(input: string | undefined | null): string {
  if (!input || typeof input !== 'string') {
    return '';
  }
  const idx = input.indexOf('&#13');
  return idx === -1 ? input : input.slice(0, idx);
}
