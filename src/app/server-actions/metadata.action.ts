import { $fetchS, $fetchP } from '../server-api';
import { Property } from '@/src/shared/types';
import { Place } from '@/src/widgets/catalog-filters/model';

interface CategoryMetadata {
	statusCode: number;
	message: string;
	data: {
		category_name: string;
		pages_count: number;
		last_modified: string;
	}[];
}

interface NewsMetadata {
	statusCode: number;
	message: string;
	data: {
		createdAt: string;
		updatedAt: string;
		newsTranslations: {
			link: string;
			language: {
				language_code: string;
			};
		}[];
	}[];
}

interface GetNewsByIdMetadataParams {
	langCode: string;
	id: number | string;
}

interface IGetNewsByIdMetadataResponse {
	statusCode: number;
	message: string;
	data: {
		news: {
			title: string;
			description: string;
			posterLink: string;
			createdAt: string;
			updatedAt: string;
		};
		links: {
			link: string;
			language: {
				language_code: string;
			};
		}[];
	};
}

class Metadata {
	public async getCategoryMetadata(): Promise<CategoryMetadata | undefined> {
		const response = await $fetchS('metadata/categories');
		if (!response.ok) return undefined;
		return await response.json();
	}

	public async getNewsMetadata(): Promise<NewsMetadata | undefined> {
		const response = await $fetchS('metadata/all-news');
		if (!response.ok) return undefined;
		return await response.json();
	}

	public async getNewsByIdMetadata(
		params: GetNewsByIdMetadataParams
	): Promise<IGetNewsByIdMetadataResponse | undefined> {
		const response = await $fetchS(
			`metadata/news/?langCode=${params.langCode}&id=${params.id}`
		);
		if (!response.ok) return undefined;
		return await response.json();
	}

	public async getPlacesMetadata(): Promise<Place[] | undefined> {
		const response = await $fetchP('places');
		if (!response.ok) return undefined;
		return await response.json();
	}

	public async getPropertiesMetadata(): Promise<Property[] | undefined> {
		const response = await $fetchP('properties');
		if (!response.ok) return undefined;
		return await response.json();
	}
}

export default new Metadata();
