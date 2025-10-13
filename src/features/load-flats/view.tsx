'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { FlatCard } from '@/src/entities/flat-card';
import { Property } from '@/src/shared/types';
import { $fetchCP } from '@/src/app/client-api/model';

type Filters = {
  province?: string;
  town?: string;
  type?: string;
  order?: 'asc' | 'desc';
  ref?: string;
};

type Props = {
  locale: string;
  filters: Filters;
  currentCount: number;
  loadMore: string;
  loading: string;
};

const LIMIT = 12;

export const LoadFlats = ({ locale, filters, currentCount, loading }: Props) => {
  const [page, setPage] = useState<number>(Math.floor(currentCount / LIMIT) + 1);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [flats, setFlats] = useState<Property[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(currentCount >= LIMIT);

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Reset on filter change
  useEffect(() => {
    setPage(Math.floor(currentCount / LIMIT) + 1);
    setFlats([]);
    setHasMore(currentCount >= LIMIT);
  }, [filters.province, filters.town, filters.type, filters.order, filters.ref, currentCount]);

  const loadFlats = useCallback(async () => {
    if (!hasMore || isFetching) return;
    setIsFetching(true);
    try {

      const params = new URLSearchParams();
      if (filters.order) params.set('order', filters.order === 'desc' ? '-price' : 'price');
      if (filters.province) params.set('province', filters.province);
      if (filters.town) params.set('town', filters.town);
      if (filters.type) params.set('type', filters.type);
      if (filters.ref) params.set('ref', filters.ref);
      params.set('page', String(page));
      params.set('limit', String(LIMIT));

      const url = `properties${params.toString() ? `?${params.toString()}` : ''}`;
      const res = await $fetchCP(url, {
        headers: {
          'Accept-Language': locale
        }
      });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const data = (await res.json()) as Property[];
      setFlats(prev => [...prev, ...(data || [])]);
      setPage(prev => prev + 1);
      // if less than limit - this is the last chunk
      if (!data || data.length < LIMIT) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
    } catch (err) {
      console.error('Load flats error', err);
    } finally {
      setIsFetching(false);
    }
  }, [filters, hasMore, isFetching, page, locale]);

  // IntersectionObserver for infinite scroll
  useEffect(() => {
    if (!sentinelRef.current || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadFlats();
        }
      },
      { threshold: 1.0 }
    );

    observer.observe(sentinelRef.current);

    return () => {
      if (sentinelRef.current) {
        observer.unobserve(sentinelRef.current);
      }
    };
  }, [loadFlats, hasMore]);

  const totalLoaded = currentCount + flats.length;

  return (
    <div className="mt-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-fr gap-2.5 sm:gap-5">
        {flats.map((item, index) => (
          <Link
            key={`load-${index}-${item._id}`}
            href={`/${locale}/property-catalog/flat/${item.slug}`}
            className="block"
          >
            <FlatCard
              images={item.images}
              title={item.title}
              price={item.price}
              beds={item.beds}
              features={item.features}
            />
          </Link>
        ))}
      </div>

      {/* Sentinel for infinite scroll */}
      {hasMore && (
        <div ref={sentinelRef} className="h-12 flex items-center justify-center text-gray-400">
          {loading}
        </div>
      )}
    </div>
  );
};

export default LoadFlats;
