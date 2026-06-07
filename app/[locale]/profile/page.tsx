import ProfileView from '@/src/screens/profile/view';
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
  return <ProfileView locale={locale} />;
}
