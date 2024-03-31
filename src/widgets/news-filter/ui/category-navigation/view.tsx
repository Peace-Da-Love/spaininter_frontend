import { Link } from '@/src/shared/utils';
import { useTranslations } from 'next-intl';
import { FC } from 'react';
import { cn } from '@/src/shared/utils';
import { categoryNavigationData } from '@/src/shared/constance';

type Props = {
	categoryName: string;
};

export const CategoryNavigation: FC<Props> = ({ categoryName }) => {
	const t = useTranslations('IndexPage.navigation');

	return (
		<nav className={'hidden md:block mb-10'}>
			<ul className={'overflow-x-auto flex gap-10 justify-start items-center'}>
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
									'inline-block text-secondary rounded-full py-2.5 px-5 font-medium hover:bg-primary hover:text-white transition-colors',
									categoryName === item && 'bg-primary text-white'
								)}
							>
								{t(item)}
							</Link>
						</li>
					);
				})}
			</ul>
		</nav>
	);
};
