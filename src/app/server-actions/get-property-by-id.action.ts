'use server';

import { Property } from '@/src/shared/types';
import { $fetchP } from '@/src/app/server-api/model';

type Params = {
	id: string | number;
	locale: string;
};


export async function getPropertyById(
	params: Params
): Promise<Property> {
	const response = await $fetchP(
		`properties/${params.id}`,
		{
			headers: {
			'Accept-Language': params.locale,
			Accept: 'application/json'
			}
		}
	);

	const data = (await response.json()) as Property;
	return data;
}
