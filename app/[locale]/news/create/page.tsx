import NewsCreateView from '@/src/screens/news-create/view';
import { Metadata } from 'next';

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: true
  }
};

type Props = {
  params: { locale: string };
};

export default function Page({ params: { locale } }: Props) {
  return <NewsCreateView locale={locale} />;
}
