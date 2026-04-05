"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import useAuth from '@/src/shared/stores/auth';
import { ChannelLink } from '@/src/shared/utils';
import { locales } from '@/src/shared/configs';

type Props = { locale: string };

type UserNewsItem = {
  id?: number | string;
  title: string;
  link?: string | number;
  views?: number;
  createdAt?: string;
  status?: string;
};

type NewsTranslation = {
  title?: string;
  link?: string;
  language_id?: number;
  language_code?: string;
  language?: {
    language_id?: number;
    language_code?: string;
  };
};

const normalizeLocale = (value?: string) =>
  value?.toLowerCase().replace('_', '-').split('-')[0] ?? '';

export default function ProfileView({ locale }: Props) {
  const router = useRouter();
  const t = useTranslations('Profile');
  const accessToken = useAuth(state => state.accessToken);
  const user = useAuth(state => state.user);
  const clearAuth = useAuth(state => state.clearAuth);
  const hasHydrated = useAuth(state => state.hasHydrated);
  const fetchWithAuth = useAuth(state => state.fetchWithAuth);
  const [myNews, setMyNews] = useState<UserNewsItem[]>([]);
  const [isLoadingNews, setIsLoadingNews] = useState(false);

  useEffect(() => {
    if (!hasHydrated) return;
    if (!accessToken) {
      router.push(`/${locale}`);
    }
  }, [accessToken, hasHydrated, router, locale]);

  useEffect(() => {
    if (!hasHydrated || !accessToken) return;
    let cancelled = false;

    const loadMyNews = async () => {
      setIsLoadingNews(true);
      try {
        const res = await fetchWithAuth('/api/news/my');
        if (!res.ok) {
          if (!cancelled) setMyNews([]);
          return;
        }
        const data = await res.json();
        const items =
          data?.data?.news?.rows ??
          data?.data?.news ??
          data?.data ??
          data?.news ??
          data ??
          [];

        const normalized = Array.isArray(items)
          ? items.map((item: any) => {
              const translations: NewsTranslation[] =
                item.newsTranslations ?? item.translations ?? [];
              const preferredLocale = normalizeLocale(locale);

              const getTranslationCode = (t: NewsTranslation) =>
                normalizeLocale(t.language_code ?? t.language?.language_code);
              const getTranslationId = (t: NewsTranslation) =>
                t.language_id ?? t.language?.language_id;

              let chosen: NewsTranslation | undefined;

              if (translations.length > 0) {
                chosen = translations.find(t => {
                  const code = getTranslationCode(t);
                  if (code && code === preferredLocale) return true;
                  const id = getTranslationId(t);
                  return (
                    typeof id === 'number' &&
                    locales[id - 1] === preferredLocale
                  );
                });

                if (!chosen) {
                  for (let i = 0; i < locales.length; i += 1) {
                    const code = locales[i];
                    chosen = translations.find(t => {
                      const tCode = getTranslationCode(t);
                      const tId = getTranslationId(t);
                      return tCode === code || tId === i + 1;
                    });
                    if (chosen) break;
                  }
                }

                if (!chosen) {
                  chosen = translations[0];
                }
              }

              return {
                id: item.newsId ?? item.id ?? item.link ?? item.slug,
                title:
                  chosen?.title ??
                  item.title ??
                  item.newsTitle ??
                  '',
                link:
                  chosen?.link ??
                  item.link ??
                  item.slug ??
                  item.newsId ??
                  item.id,
                views: item.views ?? item.viewCount ?? item.viewsCount ?? 0,
                createdAt: item.createdAt,
                status: item.status
              };
            })
          : [];

        if (!cancelled) setMyNews(normalized.filter(item => item.title));
      } catch {
        if (!cancelled) setMyNews([]);
      } finally {
        if (!cancelled) setIsLoadingNews(false);
      }
    };

    loadMyNews();

    return () => {
      cancelled = true;
    };
  }, [accessToken, fetchWithAuth, hasHydrated, locale]);

  if (!hasHydrated || !accessToken) return null;

  const formatCreatedAt = (value?: string) => {
    if (!value) return '—';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return new Intl.DateTimeFormat(locale, {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          {user?.photo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.photo_url}
              alt="avatar"
              className="w-20 h-20 rounded-full object-cover"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
              ?
            </div>
          )}

          <div>
            <div className="text-2xl font-semibold">
              {user?.first_name || user?.username || t('userDefault')}
            </div>
            <div className="text-sm text-gray-500">
              {t('id')}: {user?.telegram_id ?? user?.id}
            </div>
          </div>
        </div>

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

      <div className="mt-8">
        <h3 className="text-lg font-medium">{t('myNews')}</h3>
        <div className="mt-3 overflow-x-auto border border-gray-200 rounded-lg">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-4 py-3 font-medium">{t('newsTitle')}</th>
                <th className="px-4 py-3 font-medium text-right">
                  {t('newsViews')}
                </th>
                <th className="px-4 py-3 font-medium text-right">
                  {t('newsCreatedAt')}
                </th>
                <th className="px-4 py-3 font-medium text-right">
                  {t('newsStatus')}
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoadingNews ? (
                <tr className="border-t">
                  <td className="px-4 py-4 text-gray-500" colSpan={4}>
                    {t('newsLoading')}
                  </td>
                </tr>
              ) : myNews.length === 0 ? (
                <tr className="border-t">
                  <td className="px-4 py-4 text-gray-500" colSpan={4}>
                    {t('newsEmpty')}
                  </td>
                </tr>
              ) : (
                myNews.map(item => (
                  <tr
                    key={`${item.id ?? item.link ?? item.title}`}
                    className="border-t"
                  >
                    <td className="px-4 py-3">
                      {item.link ? (
                        <ChannelLink
                          locale={locale}
                          href={`/news/${encodeURIComponent(String(item.link))}`}
                          className="text-blue-600 hover:underline"
                        >
                          {item.title}
                        </ChannelLink>
                      ) : (
                        <span>{item.title}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">
                      {item.views ?? 0}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">
                      {formatCreatedAt(item.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {item.status ?? '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
