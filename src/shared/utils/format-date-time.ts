import moment from 'moment';
import 'moment/locale/ru';
import 'moment/locale/es';
import 'moment/locale/fr';
import 'moment/locale/de';
import 'moment/locale/sv';
import 'moment/locale/pl';
import 'moment/locale/nl';

/**
 * Format date time
 * @param date - 2024-03-24 01:03:13.117 +0300
 * @param locale - en
 * @returns 2 November
 */
export function formatDateTime(date: string, locale?: string) {
	return moment(date)
		.locale(locale || 'en')
		.format('D MMMM');
}
