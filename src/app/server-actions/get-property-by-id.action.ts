'use server';

import { Property } from '@/src/shared/types';
import { $fetchP } from '@/src/app/server-api/model';

type Params = {
	slug: string;
	locale: string;
};


export async function getPropertyById(
	params: Params
): Promise<Property | undefined> {
	try {
		const response = await $fetchP(
			`properties/${params.slug}`,
			{
				headers: {
				'Accept-Language': params.locale,
				Accept: 'application/json'
				}
			}
		);

		if (!response.ok) {
			const text = await response.text();
			return undefined;
		}

		const data = (await response.json()) as Property;
		return data;
	} catch (error) {
		throw error;
	}
}
