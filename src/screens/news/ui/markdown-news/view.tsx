import { FC } from 'react';
import Markdown, { Components } from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import Image from 'next/image';
import rehypeSlug from 'rehype-slug';
import Link from 'next/link';

type Props = {
	markdown: string;
};

const components: Components = {
	a: ({ children, href }) => (
		<Link
			className={'text-light-blue underline-offset-2'}
			href={href as string}
			target='_blank'
		>
			{children}
		</Link>
	),
	img: ({ node, ...props }) => {
		return (
			<Image src={props.src as string} alt={'Image'} width={600} height={600} />
		);
	}
};

export const MarkdownNews: FC<Props> = ({ markdown }) => {
	return (
		<div className='news-content'>
			<Markdown
				rehypePlugins={[rehypeRaw, rehypeSlug]}
				components={components}
				skipHtml={false}
				className={'prose max-w-max'}
			>
				{markdown}
			</Markdown>
		</div>
	);
};
