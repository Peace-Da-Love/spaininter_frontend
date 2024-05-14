'use client';

import { Button } from '@/src/shared/components/ui';
import { AlignJustify, X } from 'lucide-react';
import { useSiteMenuStore } from '../../store';

export const BurgerButton = () => {
	const { toggle, isOpen } = useSiteMenuStore();

	return (
		<Button onClick={toggle} variant={'menu'}>
			{isOpen ? <X size={32} /> : <AlignJustify size={32} />}
		</Button>
	);
};
