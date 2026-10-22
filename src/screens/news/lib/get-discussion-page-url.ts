type NewsMetadata = {
	data: {
		links: {
			link: string;
			language: {
				language_code: string;
			};
		}[];
	};
};

export const getDiscussionPageUrl = (
	metadata: NewsMetadata | undefined,
	currentLocale: string,
	siteUrl: string | undefined
) => {
	const links = metadata?.data.links;

	if (!siteUrl || !links?.length) {
		return undefined;
	}

	const englishLink = links.find(
		item => item.language.language_code === 'en'
	)?.link;
	const currentLocaleLink = links.find(
		item => item.language.language_code === currentLocale
	)?.link;
	const link = englishLink ?? currentLocaleLink;
	const locale = englishLink ? 'en' : currentLocale;

	return link ? `${siteUrl}/${locale}/news/${link}` : undefined;
};
