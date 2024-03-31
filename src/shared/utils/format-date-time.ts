import moment from 'moment';

/**
 * Format date time
 * @param date - 2024-03-24 01:03:13.117 +0300
 * @returns 2 November 2023
 */
export function formatDateTime(date: string) {
	return moment(date, 'YYYY-MM-DD HH:mm:ss.SSS Z')
		.subtract(0, 'year')
		.format('D MMMM YYYY');
}
