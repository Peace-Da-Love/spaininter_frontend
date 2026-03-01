import { redirect } from 'next/navigation';

type Props = {
	params: { locale: string };
	searchParams?: Record<string, string | string[] | undefined>;
};

function toQueryString(
	searchParams?: Record<string, string | string[] | undefined>
): string {
	if (!searchParams) {
		return '';
	}

	const query = new URLSearchParams();

	Object.entries(searchParams).forEach(([key, value]) => {
		if (Array.isArray(value)) {
			value.forEach(item => {
				if (item) {
					query.append(key, item);
				}
			});
			return;
		}

		if (value) {
			query.set(key, value);
		}
	});

	const serialized = query.toString();
	return serialized ? `?${serialized}` : '';
}

export default function TmaEntryPage({
	params: { locale },
	searchParams
}: Props) {
	redirect(`/${locale}/tma/property-catalog${toQueryString(searchParams)}`);
}
