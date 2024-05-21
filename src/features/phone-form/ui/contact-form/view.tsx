import React, { useState } from 'react';
import { PhoneInput } from '@/src/shared/components/ui/phone-input';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage
} from '@/src/shared/components/ui/form';
import { Button } from '@/src/shared/components/ui';
import { useForm } from 'react-hook-form';
import { FormSchema } from '@/src/features/phone-form/ui/contact-form/model';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useReCaptcha } from 'next-recaptcha-v3';
import { contactFormAction } from '@/src/app/client-actions';
import { usePathname } from 'next/navigation';
import { useToast } from '@/src/shared/components/ui/use-toast';
import { LoadingSpinner } from '@/src/shared/components/ui/loading-spinner';

type Props = {};

export const ContactForm = React.forwardRef<HTMLFormElement, Props>(
	(_props, ref) => {
		const { toast } = useToast();
		const pathname = usePathname();
		const [isLoading, setIsLoading] = useState<boolean>(false);
		const { executeRecaptcha } = useReCaptcha();
		const form = useForm<z.infer<typeof FormSchema>>({
			resolver: zodResolver(FormSchema),
			defaultValues: {
				phone: ''
			}
		});

		const onSubmit = async (data: z.infer<typeof FormSchema>) => {
			let res;
			setIsLoading(true);
			try {
				const token = await executeRecaptcha('form_submit');
				res = await contactFormAction({
					phone: data.phone,
					url: `https://spaininter.com${pathname}`,
					token
				});
				if (!res) throw new Error();
				form.reset();
				toast({
					title: 'Success!'
				});
			} catch (err) {
				toast({
					title: 'Error!'
				});
				throw err;
			} finally {
				setIsLoading(false);
			}
		};

		return (
			<div
				className={
					'backdrop-blur-sm bg-white/30 p-5 min-w-60 max-w-60 rounded-2xl'
				}
			>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className={'flex flex-col gap-2.5'}
						ref={ref}
					>
						<FormField
							control={form.control}
							name='phone'
							render={({ field }) => (
								<FormItem className='flex flex-col items-start'>
									<FormControl className='w-full'>
										{/* @ts-ignore*/}
										<PhoneInput placeholder='Phone' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button
							disabled={isLoading}
							type='submit'
							className={'rounded-2xl bg-cornflower-blue h-12 text-white'}
						>
							{isLoading ? <LoadingSpinner /> : 'Send'}
						</Button>
					</form>
				</Form>
			</div>
		);
	}
);

ContactForm.displayName = 'ContactForm';
