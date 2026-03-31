import NewsCreateView from '@/src/screens/news-create/view';

type Props = {
  params: { locale: string };
};

export default function Page({ params: { locale } }: Props) {
  return <NewsCreateView locale={locale} />;
}
