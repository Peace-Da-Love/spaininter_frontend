/**
 * Format a price to a currency string
 * @param price - The price to format
 * @returns The formatted price - e.g. 50 000 €
 */
export function priceFormatter(price: number): string {
	return new Intl.NumberFormat('ru-RU', {
		style: 'currency',
		currency: 'EUR',
		minimumFractionDigits: 0
	}).format(price);
}
