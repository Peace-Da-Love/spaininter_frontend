export type NewsProps = {
	imageUrl: string;
	title: string;
	hashtagName: string;
	hashtagLink: string;
	hashtags?: NewsHashtag[];
	date: string;
	link: string;
	city: string;
	className?: string;
};

export type NewsHashtag = {
	hashtagId: number;
	hashtagName: string;
	hashtagLink: string;
};
