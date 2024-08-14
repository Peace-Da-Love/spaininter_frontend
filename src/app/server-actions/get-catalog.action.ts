'use server';

import { $fetchS } from '../server-api';
import { Property } from '@/src/shared/types';

type Params = {
	locale: string;
	page: string | number;
};

export async function getCatalog(
	params: Params
): Promise<Property[] | undefined> {
	const response = await $fetchS(
		`properties?page=${params.page}`,
		{
			headers: {
				'Accept-Language': params.locale
			}
		},
		'catalog'
	);
	if (!response.ok) return undefined;
	const data = (await response.json()) as Property[];

	return data;
}
