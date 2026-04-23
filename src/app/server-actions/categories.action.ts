import { $fetchS } from '../server-api';

export interface IHashtagsResponse {
	statusCode: number;
	message: string;
	data: {
		hashtags: THashtag[];
	};
}

export type THashtag = {
	hashtag_id: number;
	hashtag_name: string;
	news_count: number;
	createdAt: string;
};

export async function getHashtags(): Promise<IHashtagsResponse | undefined> {
	const response = await $fetchS('hashtags');
	if (!response.ok) return undefined;
	return await response.json();
}
