"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import useAuth from '@/src/shared/stores/auth';

type Props = { locale: string };

export default function ProfileView({ locale }: Props) {
  const router = useRouter();
  const t = useTranslations('Profile');
  const accessToken = useAuth(state => state.accessToken);
  const user = useAuth(state => state.user);
  const clearAuth = useAuth(state => state.clearAuth);
  const hasHydrated = useAuth(state => state.hasHydrated);

  useEffect(() => {
    if (!hasHydrated) return;
    if (!accessToken) {
      router.push(`/${locale}`);
    }
  }, [accessToken, hasHydrated, router, locale]);

  if (!hasHydrated || !accessToken) return null;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex items-center gap-4">
        {user?.photo_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={user.photo_url} alt="avatar" className="w-20 h-20 rounded-full object-cover" />
        ) : (
          <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">?
          </div>
        )}

        <div>
          <div className="text-2xl font-semibold">
            {user?.first_name || user?.username || t('userDefault')}
          </div>
          <div className="text-sm text-gray-500">{t('id')}: {user?.telegram_id ?? user?.id}</div>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-medium">{t('nftGift')}</h3>
        <div className="mt-2">
          <div>{t('model')}: {user?.gift?.model ?? '—'}</div>
          <div>{t('background')}: {user?.gift?.background ?? '—'}</div>
          <div>{t('pattern')}: {user?.gift?.pattern ?? '—'}</div>
          <div>{t('rarity')}: {user?.gift?.rarity ?? '—'}</div>
        </div>
      </div>

      <div className="mt-6">
        <button
          className="px-4 py-2 bg-red-600 text-white rounded"
          onClick={() => {
            clearAuth();
            router.push(`/${locale}`);
          }}
        >
          {t('signOut')}
        </button>
      </div>
    </div>
  );
}
