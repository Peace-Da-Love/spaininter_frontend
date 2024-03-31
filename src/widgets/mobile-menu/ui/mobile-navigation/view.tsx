import { useTranslations } from 'next-intl';
import { categoryNavigationData } from '@/src/shared/constance';
import { cn, Link } from '@/src/shared/utils';
import { FC } from 'react';

type Props = {
	categoryName?: string;
};

export const MobileNavigation: FC<Props> = ({ categoryName }) => {
	const t = useTranslations('IndexPage.navigation');

	return (
		<div className={'pl-5 py-4'}>
			<ul className={'overflow-x-auto flex gap-5 items-center pr-4'}>
				{categoryNavigationData.map((item, index) => {
					return (
						<li key={`Category navigation item - ${index}`}>
							<Link
								href={{
									pathname: '/category/[categoryName]/[page]',
									params: {
										categoryName: item,
										page: 1
									}
								}}
								scroll={false}
								className={cn(
									'disabled:pointer-events-none inline-block text-xs rounded-full py-1.5 px-2.5 font-medium hover:bg-primary hover:text-white transition-colors',
									categoryName === item && 'bg-primary text-white'
								)}
							>
								{t(item)}
							</Link>
						</li>
					);
				})}
			</ul>
		</div>
	);
};
