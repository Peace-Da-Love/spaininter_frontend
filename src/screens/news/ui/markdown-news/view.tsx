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
	h1: ({ children }) => (
		<h2 className={'text-3xl font-bold mb-10'}>{children}</h2>
	),
	h2: ({ children, ...props }) => {
		return (
			<h3 id={props.id} className={'text-xl font-bold mt-8 mb-2.5'}>
				{children}
			</h3>
		);
	},
	h3: ({ children, ...props }) => (
		<h4 id={props.id} className={'text-lg font-bold mt-5 mb-2.5'}>
			{children}
		</h4>
	),
	h4: ({ children }) => (
		<h5 className={'text-lg font-bold mt-5 mb-2.5'}>{children}</h5>
	),
	h5: ({ children }) => (
		<h6 className={'text-lg font-bold mt-5 mb-2.5'}>{children}</h6>
	),
	h6: ({ children }) => (
		<h6 className={'text-lg font-bold mt-5 mb-2.5'}>{children}</h6>
	),
	a: ({ children, href }) => (
		<Link
			className={'text-blue hover:underline underline-offset-2'}
			href={href as string}
			target='_blank'
		>
			{children}
		</Link>
	),
	p: ({ children }) => <p className={'text-lg mt-4'}>{children}</p>,
	ol: ({ children }) => (
		<ol className={'text-lg list-decimal mb-5'}>{children}</ol>
	),
	ul: ({ children }) => (
		<ul className={'text-lg list-disc mb-5'}>{children}</ul>
	),
	img: ({ node, ...props }) => {
		return (
			<div className={'mt-2.5'}>
				<Image
					src={props.src as string}
					alt={'Image'}
					width={600}
					height={600}
				/>
			</div>
		);
	}
};

export const MarkdownNews: FC<Props> = ({ markdown }) => {
	return (
		<div>
			<Markdown
				rehypePlugins={[rehypeRaw, rehypeSlug]}
				components={components}
				skipHtml={false}
			>
				{markdown}
			</Markdown>
		</div>
	);
};
