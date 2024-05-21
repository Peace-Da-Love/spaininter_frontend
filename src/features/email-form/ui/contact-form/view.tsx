import React, { useState } from 'react';
import { Input } from '@/src/shared/components/ui/input';
import { Button } from '@/src/shared/components/ui';
import { useToast } from '@/src/shared/components/ui/use-toast';
import { usePathname } from 'next/navigation';
import { useReCaptcha } from 'next-recaptcha-v3';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { FormSchema } from './model';
import { zodResolver } from '@hookform/resolvers/zod';
import {
	FormControl,
	FormField,
	FormItem,
	FormMessage,
	Form
} from '@/src/shared/components/ui/form';
import { contactFormAction } from '@/src/app/client-actions';
import { LoadingSpinner } from '@/src/shared/components/ui/loading-spinner';

type Props = {};

export const ContactForm = React.forwardRef<HTMLFormElement, Props>(
	(props, ref) => {
		const { toast } = useToast();
		const pathname = usePathname();
		const [isLoading, setIsLoading] = useState<boolean>(false);
		const { executeRecaptcha } = useReCaptcha();
		const form = useForm<z.infer<typeof FormSchema>>({
			resolver: zodResolver(FormSchema),
			defaultValues: {
				email: ''
			}
		});

		const onSubmit = async (data: z.infer<typeof FormSchema>) => {
			let res;
			setIsLoading(true);
			try {
				const token = await executeRecaptcha('form_submit');
				res = await contactFormAction({
					email: data.email,
					url: `https://spaininter.com${pathname}`,
					token
				});
				if (!res) throw new Error();
				form.reset();
				toast({
					title: 'Success!'
				});
			} catch (err) {
				console.log(res);
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
							name='email'
							render={({ field }) => (
								<FormItem className='flex flex-col items-start'>
									<FormControl className='w-full'>
										{/* @ts-ignore*/}
										<Input placeholder='Email' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button
							type='submit'
							disabled={isLoading}
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
