import { Link } from '@/src/shared/utils';
import IcEducation from '@/src/app/icons/ic_education.svg';
import { Button } from '@/src/shared/components/ui';

export const EducationButton = () => {
	return (
		<Button variant={'menu'} asChild>
			<Link href={'/courses'}>
				<IcEducation />
			</Link>
		</Button>
	);
};
