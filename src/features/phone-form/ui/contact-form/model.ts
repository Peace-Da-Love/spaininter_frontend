import { isValidPhoneNumber } from 'react-phone-number-input';
import { z } from 'zod';

export const FormSchema = z.object({
	phone: z
		.string()
		.refine(isValidPhoneNumber, { message: 'Invalid phone number' })
});
