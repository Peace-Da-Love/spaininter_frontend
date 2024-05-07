import { FC } from 'react';
import GithubSlugger from 'github-slugger';
import { useTranslations } from 'next-intl';
import removeMarkdown from 'markdown-to-text';
import he from 'he';

type Props = {
	markdown: string;
};

export const Navigation: FC<Props> = ({ markdown }) => {
	const t = useTranslations('Components');
	const headings = markdown.match(/#{1,6} .+/g) || [];
	const toc = headings.map(heading => {
		const title = he.decode(removeMarkdown(heading));
		const id = new GithubSlugger().slug(title);
		return { id, title };
	});

	if (toc.length === 0) {
		return null;
	}

	return (
		<div className={'bg-card px-5 py-8 rounded-3xl sticky top-5 left-0 w-full'}>
			<p className={'text-xl mb-4 font-bold'}>{t('content')}</p>
			<nav>
				<ol className={'list-decimal pl-4'}>
					{toc.map(({ id, title }) => {
						return (
							<li
								key={id}
								className={'text-sm font-medium pl-0 mb-3 hover:underline'}
							>
								<a href={`#${id}`}>{title}</a>
							</li>
						);
					})}
				</ol>
			</nav>
		</div>
	);
};
