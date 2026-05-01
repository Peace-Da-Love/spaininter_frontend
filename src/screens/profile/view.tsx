"use client";

import { useEffect, useMemo, useState } from 'react';
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

const NEWS_PAGE_SIZE = 10;

const normalizeLocale = (value?: string) =>
  value?.toLowerCase().replace('_', '-').split('-')[0] ?? '';

const getNestedValue = (source: any, paths: string[]) => {
  for (const path of paths) {
    const value = path
      .split('.')
      .reduce((current, key) => current?.[key], source);
    if (value !== undefined && value !== null) return value;
  }
  return undefined;
};

const normalizeTotal = (source: any, fallback: number) => {
  const value = getNestedValue(source, [
    'data.news.count',
    'data.news.total',
    'data.news.totalCount',
    'data.total',
    'data.totalCount',
    'news.count',
    'news.total',
    'total',
    'totalCount',
    'count',
    'meta.total',
    'meta.totalCount',
    'pagination.total',
    'pagination.totalCount'
  ]);
  const total = Number(value);
  return Number.isFinite(total) && total >= 0 ? total : fallback;
};

const normalizePageCount = (source: any, total: number, pageSize: number) => {
  const value = getNestedValue(source, [
    'data.news.pageCount',
    'data.news.totalPages',
    'data.pageCount',
    'data.totalPages',
    'pageCount',
    'totalPages',
    'meta.pageCount',
    'meta.totalPages',
    'pagination.pageCount',
    'pagination.totalPages'
  ]);
  const pageCount = Number(value);
  if (Number.isFinite(pageCount) && pageCount > 0) return pageCount;
  return Math.max(1, Math.ceil(total / pageSize));
};

const normalizeIsAdmin = (source: any) =>
  Boolean(
    getNestedValue(source, [
      'data.isAdmin',
      'data.admin',
      'data.user.isAdmin',
      'isAdmin',
      'admin',
      'user.isAdmin'
    ])
  );

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
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [totalNews, setTotalNews] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);

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
        const params = new URLSearchParams({
          page: String(currentPage),
          limit: String(NEWS_PAGE_SIZE)
        });
        const res = await fetchWithAuth(`/api/news/my?${params.toString()}`);
        if (!res.ok) {
          if (!cancelled) {
            setMyNews([]);
            setTotalNews(0);
            setPageCount(1);
          }
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

        const normalizedNews = normalized
          .filter(item => item.title)
          .sort((a, b) => {
            const left = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const right = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return right - left;
          });
        const total = normalizeTotal(data, normalizedNews.length);
        const nextPageCount = normalizePageCount(data, total, NEWS_PAGE_SIZE);
        const shouldPaginateClientSide =
          normalizedNews.length > NEWS_PAGE_SIZE &&
          total === normalizedNews.length;
        const visibleNews = shouldPaginateClientSide
          ? normalizedNews.slice(
              (currentPage - 1) * NEWS_PAGE_SIZE,
              currentPage * NEWS_PAGE_SIZE
            )
          : normalizedNews;

        if (!cancelled) {
          setMyNews(visibleNews);
          setTotalNews(total);
          setPageCount(nextPageCount);
          setIsAdmin(normalizeIsAdmin(data));
          if (currentPage > nextPageCount) {
            setCurrentPage(nextPageCount);
          }
        }
      } catch {
        if (!cancelled) {
          setMyNews([]);
          setTotalNews(0);
          setPageCount(1);
        }
      } finally {
        if (!cancelled) setIsLoadingNews(false);
      }
    };

    loadMyNews();

    return () => {
      cancelled = true;
    };
  }, [accessToken, currentPage, fetchWithAuth, hasHydrated, locale]);

  const paginationItems = useMemo(() => {
    return Array.from({ length: pageCount }, (_, index) => index + 1).filter(
      page =>
        page === 1 ||
        page === pageCount ||
        Math.abs(page - currentPage) <= 1
    );
  }, [currentPage, pageCount]);

  if (!hasHydrated || !accessToken) return null;

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') ?? '';
      const logoutUrl = apiBase
        ? `${apiBase}/api/auth/user/logout`
        : '/api/auth/user/logout';

      await fetch(logoutUrl, {
        method: 'DELETE',
        credentials: 'include',
      });
    } catch {
      // ignore logout network issues and clear local state anyway
    } finally {
      clearAuth();
      router.push(`/${locale}`);
      setIsLoggingOut(false);
    }
  };

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
          onClick={handleLogout}
        >
          {t('signOut')}
        </button>
      </div>

      <div className="mt-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-lg font-medium">
            {isAdmin ? t('allNews') : t('myNews')}
          </h3>
          {totalNews > 0 && (
            <div className="text-sm text-gray-500">
              {t('newsPaginationInfo', {
                page: currentPage,
                pages: pageCount,
                total: totalNews
              })}
            </div>
          )}
        </div>
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
        {pageCount > 1 && (
          <nav
            aria-label="Profile news pagination"
            className="mt-4 flex flex-wrap items-center justify-end gap-2"
          >
            <button
              type="button"
              className="rounded-md border border-gray-200 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
              disabled={currentPage === 1 || isLoadingNews}
              onClick={() => setCurrentPage(page => Math.max(1, page - 1))}
            >
              {t('previousPage')}
            </button>
            {paginationItems.map((page, index) => {
              const previousPage = paginationItems[index - 1];
              const showGap = previousPage && page - previousPage > 1;

              return (
                <div key={page} className="flex items-center gap-2">
                  {showGap && <span className="text-sm text-gray-400">...</span>}
                  <button
                    type="button"
                    className={`h-9 min-w-9 rounded-md border px-3 text-sm ${
                      page === currentPage
                        ? 'border-blue-600 bg-blue-600 text-white'
                        : 'border-gray-200'
                    }`}
                    disabled={isLoadingNews}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                </div>
              );
            })}
            <button
              type="button"
              className="rounded-md border border-gray-200 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
              disabled={currentPage === pageCount || isLoadingNews}
              onClick={() =>
                setCurrentPage(page => Math.min(pageCount, page + 1))
              }
            >
              {t('nextPage')}
            </button>
          </nav>
        )}
      </div>
    </div>
  );
}
