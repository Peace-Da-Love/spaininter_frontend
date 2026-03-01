'use client';

import Link, { type LinkProps } from 'next/link';
import { usePathname } from 'next/navigation';
import { type AnchorHTMLAttributes } from 'react';
import { buildChannelHref } from './channel-route';

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> &
  Omit<LinkProps, 'href'> & {
    href: string;
    locale: string;
    preserveChannel?: boolean;
  };

export function ChannelLink({
  href,
  locale,
  preserveChannel = true,
  ...props
}: Props) {
  const pathname = usePathname();
  const finalHref = preserveChannel
    ? buildChannelHref(pathname, locale, href)
    : href;

  return <Link href={finalHref} {...props} />;
}
