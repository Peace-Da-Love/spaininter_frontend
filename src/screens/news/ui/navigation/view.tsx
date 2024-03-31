import { FC } from 'react';
import GithubSlugger from 'github-slugger';

type Props = {
	markdown: string;
};

export const Navigation: FC<Props> = ({ markdown }) => {
	const headings = markdown.match(/#{1,6} .+/g) || [];
	const toc = headings.map(heading => {
		const level = heading.match(/#/g)?.length || 0;
		const title = heading.replace(/#{1,6} /, '');
		const id = new GithubSlugger().slug(title);
		return { level, id, title };
	});

	return (
		<div className={'bg-card px-5 py-8 rounded-3xl sticky top-5 left-0 w-full'}>
			<p className={'text-xl mb-4 font-bold'}>Содержание</p>
			<nav>
				<ul>
					{toc.map(({ level, id, title }) => {
						if (level === 1) {
							return (
								<li key={id} className={'text-sm font-medium pl-0 mb-4'}>
									<a href={`#${id}`}>{title}</a>
								</li>
							);
						}

						if (level === 2) {
							return (
								<li key={id} className={'text-sm font-medium pl-3 my-2'}>
									<a href={`#${id}`}>{title}</a>
								</li>
							);
						}

						if (level === 3) {
							return (
								<li key={id} className={'text-sm font-medium pl-6 mb-1'}>
									<a href={`#${id}`}>{title}</a>
								</li>
							);
						}
					})}
				</ul>
			</nav>
		</div>
	);
};
