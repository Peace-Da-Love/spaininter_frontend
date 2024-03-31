import { $fetch } from '@/src/app/api';

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

class Metadata {
	public async getCategoryMetadata(): Promise<CategoryMetadata | undefined> {
		const response = await $fetch('metadata/categories');
		if (!response.ok) return undefined;
		return await response.json();
	}

	public async getNewsMetadata(): Promise<NewsMetadata | undefined> {
		const response = await $fetch('metadata/news');
		if (!response.ok) return undefined;
		return await response.json();
	}
}

export default new Metadata();
