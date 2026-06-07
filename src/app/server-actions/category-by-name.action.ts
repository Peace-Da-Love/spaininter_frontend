import { $fetchS } from '../server-api';

type Params = {
	id: string | number;
};

export interface IHashtagResponse {
	statusCode: number;
	message: string;
	data: {
		hashtag: {
			hashtag_id: number;
			hashtag_name: string;
			createdAt: string;
		};
	};
}

export async function getHashtagById(
	params: Params
): Promise<IHashtagResponse | undefined> {
	const response = await $fetchS(`hashtags/hashtag?id=${params.id}`);
	if (!response.ok) return undefined;
	return await response.json();
}
