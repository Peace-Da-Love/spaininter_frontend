import ProfileView from '@/src/screens/profile/view';

type Props = {
  params: { locale: string };
};

export default function Page({ params: { locale } }: Props) {
  return <ProfileView locale={locale} />;
}
