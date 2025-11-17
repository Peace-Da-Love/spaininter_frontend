/**
 * Format category name as a tag with hashtag prefix
 * Converts to lowercase and adds # prefix
 * @param {string} categoryName - category name
 * @returns {string} formatted category name with # prefix
 */
export const formatCategory = (categoryName: string): string => {
	if (!categoryName) return '#';
	// Convert to lowercase and add # prefix
	return `#${categoryName.toLowerCase().replace(/\s+/g, '_')}`;
};

/**
 * Get category name without hashtag (for URLs and links)
 * @param {string} categoryName - category name
 * @returns {string} lowercase category name
 */
export const getCategoryNameForUrl = (categoryName: string): string => {
	if (!categoryName) return '';
	return categoryName.toLowerCase().replace(/\s+/g, '_');
};
