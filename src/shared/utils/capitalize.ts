/**
 * Capitalize word
 * @param {string} word - word
 * @returns {string} capitalized word
 */
export const capitalize = (word: string): string => {
	const firstLetter: string = word.charAt(0);
	const firstLetterCap: string = firstLetter.toUpperCase();
	const remainingLetters: string = word.slice(1);
	return firstLetterCap + remainingLetters;
};
