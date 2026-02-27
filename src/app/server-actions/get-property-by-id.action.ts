'use server';

import { Property } from '@/src/shared/types';
import { $fetchP } from '@/src/app/server-api/model';
import { convertEurToTon } from '@/src/shared/utils/ton-converter';

type Params = {
	slug: string;
	locale: string;
};


export async function getPropertyById(
	params: Params
): Promise<Property | undefined> {
	try {
		// Extract ID from slug (last part after last dash)
		const id = params.slug.split('-').pop();
		if (!id || isNaN(Number(id))) {
			console.error("[getPropertyById] Invalid slug format:", params.slug);
			return undefined;
		}

		const response = await $fetchP(
			`properties/${id}`,
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
        
		// Convert EUR price to TON
		if (data.price && data.currency === 'EUR') {
			try {
				data.price_ton = await convertEurToTon(data.price);
			} catch (error) {
				console.warn('[getPropertyById] Failed to convert price to TON:', error);
			}
		}
        
		return data;
	} catch (error) {
		throw error;
	}
}
