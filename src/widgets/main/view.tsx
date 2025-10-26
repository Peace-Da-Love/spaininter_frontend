'use client';

import { FC } from 'react';
import { usePathname } from 'next/navigation';
import { SiteMenu } from '@/src/widgets/site-menu';
import { RequestMenu } from '@/src/widgets/request-menu';

type Props = {
  className?: string;
  children: React.ReactNode;
};

export const Main: FC<Props> = ({ className, children }) => {
  const pathname = usePathname()

  const isPropertyCatalogPage = /^\/[a-z]{2}(\/property-catalog(\b|\/.*))?$/.test(pathname)

  return (
    <main className={'w-full flex-grow py-5'}>
      {children}

      {!isPropertyCatalogPage && (
        <SiteMenu
          className={'fixed bottom-2.5 right-2.5 z-50 inline-flex md:hidden'}
        />      
        )}
    <RequestMenu className={'fixed bottom-2.5 z-50'} />
    </main>
  );
};
