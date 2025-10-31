import { FC } from 'react';
import Markdown, { Components } from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import remarkUnwrapImages from 'remark-unwrap-images';
import Link from 'next/link';
import { processMarkdownEmbeds } from '@/src/shared/utils/processMarkdownEmbeds';
import { TikTokEmbedLoader } from './tiktok-embed-loader';

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
	iframe: ({ node, ...props }) => (
		<iframe
			{...props}
			loading='lazy'
			className='rounded-lg'
			allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
			allowFullScreen
		/>
	),
	blockquote: ({ node, ...props }) => <blockquote {...props} />
}

export const MarkdownNews: FC<Props> = ({ markdown }) => {
    const processedMarkdown = processMarkdownEmbeds(markdown);
    return (
		<div className='news-content'>
			<Markdown
				rehypePlugins={[rehypeRaw]}
				remarkPlugins={[remarkUnwrapImages, remarkGfm]}
				components={components}
				skipHtml={false}
				className={'prose max-w-max'}
			>
				{processedMarkdown}
			</Markdown>
			<TikTokEmbedLoader />
		</div>
	);
};
