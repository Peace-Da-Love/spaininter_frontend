import { FC } from 'react';
import Markdown, { Components } from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import Image from 'next/image';
import rehypeSlug from 'rehype-slug';
import remarkUnwrapImages from 'remark-unwrap-images';
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
	)
};

export const MarkdownNews: FC<Props> = ({ markdown }) => {
	return (
		<div className='news-content'>
			<Markdown
				rehypePlugins={[rehypeRaw, rehypeSlug]}
				remarkPlugins={[remarkUnwrapImages, remarkGfm]}
				components={components}
				skipHtml={false}
				className={'prose max-w-max'}
			>
				{markdown}
			</Markdown>
		</div>
	);
};
