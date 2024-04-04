import { Link } from '@/src/shared/utils';
import { FC } from 'react';
import { cn } from '@/src/shared/utils';
import { TCategory } from '@/src/app/server-actions';
import { useTranslations } from 'next-intl';

type Props = {
	categoryName: string;
	categories?: TCategory[];
};

export const CategoryNavigation: FC<Props> = ({ categoryName, categories }) => {
	const t = useTranslations('IndexPage.navigation');

	if (!categories) return <div className={'mb-10'}>Categories not found</div>;

	return (
		<nav className={'hidden md:block mb-10'}>
			<ul className={'overflow-x-auto flex gap-10 justify-start items-center'}>
				<li>
					<Link
						href={{
							pathname: '/category/[categoryName]/[page]',
							params: {
								categoryName: 'latest',
								page: 1
							}
						}}
						scroll={false}
						className={cn(
							'capitalize inline-block text-secondary rounded-full py-2.5 px-5 font-medium hover:bg-primary hover:text-white transition-colors',
							categoryName === 'latest' && 'bg-primary text-white'
						)}
					>
						{t('latest')}
					</Link>
				</li>
				{categories.map(item => {
					return (
						<li key={`Category navigation item - ${item.category_id}`}>
							<Link
								href={{
									pathname: '/category/[categoryName]/[page]',
									params: {
										categoryName: item.category_key,
										page: 1
									}
								}}
								scroll={false}
								className={cn(
									'capitalize inline-block text-secondary rounded-full py-2.5 px-5 font-medium hover:bg-primary hover:text-white transition-colors',
									categoryName === item.category_key && 'bg-primary text-white'
								)}
							>
								{item.category_name}
							</Link>
						</li>
					);
				})}
			</ul>
		</nav>
	);
};
