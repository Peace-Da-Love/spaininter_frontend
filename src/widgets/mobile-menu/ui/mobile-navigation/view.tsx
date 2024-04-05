import { useTranslations } from 'next-intl';
import { cn, Link } from '@/src/shared/utils';
import { FC } from 'react';
import { TCategory } from '@/src/app/server-actions';

type Props = {
	categoryName?: string;
	categories?: TCategory[];
};

export const MobileNavigation: FC<Props> = ({ categoryName, categories }) => {
	const t = useTranslations('IndexPage.navigation');

	return (
		<div className={'pl-5 py-4'}>
			<ul className={'overflow-x-auto flex gap-5 items-center pr-4'}>
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
							'disabled:pointer-events-none inline-block text-xs rounded-full py-1.5 px-2.5 font-medium hover:bg-primary hover:text-white transition-colors',
							categoryName === 'latest' && 'bg-primary text-white'
						)}
					>
						{t('latest')}
					</Link>
				</li>
				{categories?.map(item => {
					return (
						<li key={`Category mobile navigation item - ${item.category_id}`}>
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
									'capitalize disabled:pointer-events-none inline-block text-xs rounded-full py-1.5 px-2.5 font-medium hover:bg-primary hover:text-white transition-colors',
									categoryName === item.category_name && 'bg-primary text-white'
								)}
							>
								{item.category_name}
							</Link>
						</li>
					);
				})}
			</ul>
		</div>
	);
};
