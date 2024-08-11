'use server';

import { $fetchS } from '../server-api';

type Params = {
	langCode: string;
	name: string;
};

export interface ICategoryNameResponse {
	statusCode: number;
	message: string;
	data: {
		categoryName: string;
	};
}

export async function getCategoryByName(
	params: Params
): Promise<ICategoryNameResponse | undefined> {
	const response = await $fetchS(
		`categories/get-by-name/?langCode=${params.langCode}&name=${params.name}`
	);
	if (!response.ok) return undefined;
	return await response.json();
}
