import { $fetchC } from '../client-api';

interface ContactFormActionDto {
	email?: string;
	phone?: string;
	url: string;
	token: string;
}

interface IContactFormActionResponse {
	statusCode: number;
	message: string;
}

export async function contactFormAction(
	dto: ContactFormActionDto
): Promise<IContactFormActionResponse | undefined> {
	const response = await $fetchC('channels/send-application', {
		method: 'POST',
		body: JSON.stringify(dto)
	});
	if (!response.ok) return undefined;
	return await response.json();
}
