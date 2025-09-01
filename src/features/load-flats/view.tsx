'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/src/shared/components/ui';
import { FlatCard } from '@/src/entities/flat-card';
import { Property } from '@/src/shared/types';

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

export const LoadFlats = ({ locale, filters, currentCount, loadMore, loading }: Props) => {
  const [page, setPage] = useState<number>(Math.floor(currentCount / LIMIT) + 1);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [flats, setFlats] = useState<Property[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(currentCount >= LIMIT);

  // If filters have changed - reset states
  useEffect(() => {
    setPage(Math.floor(currentCount / LIMIT) + 1);
    setFlats([]);
    setHasMore(currentCount >= LIMIT);
  }, [filters.province, filters.town, filters.type, filters.order, filters.ref, currentCount]);

  const buildUrl = (pageNum: number, locale: string) => {
    const params = new URLSearchParams();
    if (filters.order) {
      params.set('order', filters.order === 'desc' ? '-price' : 'price');
    }
    if (filters.province) params.set('province', filters.province);
    if (filters.town) params.set('town', filters.town);
    if (filters.type) params.set('type', filters.type);
    if (filters.ref) params.set('ref', filters.ref);

    params.set('page', String(pageNum));
    params.set('limit', String(LIMIT));
    params.set('locale', locale);
    
    return `https://prop.spaininter.com/api/properties${params.toString() ? `?${params.toString()}` : ''}`;
  };

  const loadFlats = async () => {
    if (!hasMore || isFetching) return;
    setIsFetching(true);
    try {
      const url = buildUrl(page, locale);
      const res = await fetch(url, {
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
  };

  const totalLoaded = currentCount + flats.length;

  return (
    <div className="mt-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-fr gap-2.5 sm:gap-5">
        {flats.map((item, index) => (
          <Link
            key={`load-${index}-${item._id}`}
            href={`/${locale}/property-catalog/flat/${item._id}`}
            className="block"
          >
            <FlatCard
              images={item.images}
              title ={item.title}
              price={item.price}
              beds={item.beds}
              features={item.features}
            />
          </Link>
        ))}
      </div>

      {/* Show button if there are more houses*/}
      {hasMore && totalLoaded > 0 && (
        <div className="text-center mt-5">
          <Button
            className="py-1.5 px-5"
            disabled={isFetching}
            variant="primary"
            onClick={loadFlats}
          >
            {isFetching ? loading : loadMore}
          </Button>
        </div>
      )}
    </div>
  );
};

export default LoadFlats;
