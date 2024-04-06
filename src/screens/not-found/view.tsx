import { Link } from '@/src/shared/utils';

export const NotFoundPage = () => {
	return (
		<section
			className={
				'mx-auto my-10 max-w-xl flex flex-col justify-center items-center'
			}
		>
			<h1 className={'text-8xl font-bold mt-10'}>404</h1>
			<h2 className={'text-4xl font-semibold mt-4'}>Page not found</h2>
			<Link
				className={
					'text-xl font-medium mt-4 text-light-blue hover:underline underline-offset-2'
				}
				href='/'
			>
				Go to Home page
			</Link>
		</section>
	);
};
