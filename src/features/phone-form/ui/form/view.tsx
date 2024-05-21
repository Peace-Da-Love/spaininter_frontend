import React from 'react';
import { PhoneInput } from '@/src/shared/components/ui/phone-input';
import { Button } from '@/src/shared/components/ui';

type Props = {};

export const Form = React.forwardRef<HTMLFormElement, Props>((props, ref) => {
	return (
		<div
			className={
				'backdrop-blur-sm bg-white/30 p-5 min-w-60 max-w-60 rounded-2xl'
			}
		>
			<form className={'flex flex-col gap-2.5'} ref={ref}>
				<PhoneInput placeholder={'Телефон'} />
				<Button className={'rounded-2xl bg-cornflower-blue h-12 text-white'}>
					Send
				</Button>
			</form>
		</div>
	);
});

Form.displayName = 'Form';
