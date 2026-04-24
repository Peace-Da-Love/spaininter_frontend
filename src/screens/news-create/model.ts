import { z } from 'zod';

export const createNewsCreateSchema = (t: (key: string) => string) =>
	z.object({
		category_names: z
			.array(
				z
					.string()
					.transform(value => value.trim().toLowerCase())
					.refine(
						value => /^[a-z0-9_]{2,50}$/.test(value),
						t('validation.hashtagInvalid')
					)
			)
			.min(1, t('validation.hashtagRequired')),
		poster_link: z.string().min(1, t('validation.posterRequired')),
		title: z
			.string()
			.nonempty(t('validation.titleRequired'))
			.min(5, t('validation.titleMin'))
			.max(100, t('validation.titleMax')),
		description: z
			.string()
			.nonempty(t('validation.descriptionRequired'))
			.min(5, t('validation.descriptionMin'))
			.max(255, t('validation.descriptionMax')),
		content: z
			.string()
			.nonempty(t('validation.contentRequired'))
			.min(5, t('validation.contentMin'))
			.max(50000, t('validation.contentMax'))
	});
