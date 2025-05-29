import { CatalogTelegram } from '@/src/screens/catalog-telegram';
import { Metadata } from 'next';
import { FC } from 'react';

export const metadata: Metadata = {
	title: 'Каталог Telegram каналов и чатов Испания',
	description:
		'Telegram каналы Испании Мадрид, Барселона, Валенсия, Севилья, Сарагоса, Малага, Мурсия'
};

interface Props {}
const Page: FC<Props> = ({}) => {
	return <CatalogTelegram />;
};

export default Page;
