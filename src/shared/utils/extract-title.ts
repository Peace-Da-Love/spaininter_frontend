export function extractBeforeCR(input: string): string {
  const idx = input.indexOf('&#13');
  return idx === -1 ? input : input.slice(0, idx);
}
