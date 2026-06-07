import { redirect } from 'next/navigation';

type Props = {
	params: { locale: string; hashtagName: string };
};

export default function HashtagIndexPage({
	params: { locale, hashtagName }
}: Props) {
	redirect(`/${locale}/hashtag/${encodeURIComponent(hashtagName)}/1`);
}
