"use client";

import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useToast } from '@/src/shared/components/ui/use-toast';

export const CreateNewsSuccessToast = () => {
  const t = useTranslations('Pages.NewsCreate.toast');
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const shownRef = useRef(false);

  useEffect(() => {
    if (shownRef.current) return;
    if (searchParams.get('created') !== '1') return;

    shownRef.current = true;
    toast({
      title: t('successTitle'),
      description: t('successDesc')
    });

    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.delete('created');
    const query = nextParams.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }, [pathname, router, searchParams, t, toast]);

  return null;
};

