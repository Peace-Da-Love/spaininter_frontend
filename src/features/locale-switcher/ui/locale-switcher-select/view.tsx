'use client';

import { ReactNode, useTransition, FC } from 'react';
import { useRouter, usePathname, cn } from '@/src/shared/utils';
import { useParams } from 'next/navigation';
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectTrigger
} from '@/src/shared/components/ui';

type Props = {
	className?: string;
	children: ReactNode;
	defaultValue?: string;
};

export const LocaleSwitcherSelect: FC<Props> = ({
	className,
	children,
	defaultValue
}) => {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();
	const pathname = usePathname();
	const params = useParams();

	function onSelectChange(nextLocale: string) {
		startTransition(() => {
			router.replace(
				// @ts-expect-error -- TypeScript will validate that only known `params`
				// are used in combination with a given `pathname`. Since the two will
				// always match for the current route, we can skip runtime checks.
				{ pathname, params },
				{ locale: nextLocale }
			);
		});
	}

	return (
		<div className={cn('w-13', className)}>
			<Select
				disabled={isPending}
				onValueChange={onSelectChange}
				defaultValue={defaultValue}
			>
				<SelectTrigger
					className={
						'inline-flex items-center justify-center size-[72px] rounded-3xl bg-card shadow-xl text-xl font-bold uppercase'
					}
				>
					{defaultValue}
				</SelectTrigger>
				<SelectContent className={'shadow-none'}>
					<SelectGroup className={'fl-col'}>{children}</SelectGroup>
				</SelectContent>
			</Select>
		</div>
	);
};
