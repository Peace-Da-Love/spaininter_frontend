'use server';

import { $fetchP } from '../server-api';
import { Property } from '@/src/shared/types';

type Params = {
  locale: string;
  page: string | number;
  province?: string;
  town?: string;
  type?: string;
  order?: 'asc' | 'desc';
  ref?: string;
};

export async function getCatalog(
  params: Params
): Promise<Property[] | undefined> {
  const qs = new URLSearchParams();

  qs.set('page', String(params.page));
  
  if (params.order) {
    qs.set('order', params.order === 'desc' ? '-price' : 'price');
  }
  if (params.province) {
    qs.set('province', params.province);
  }
  if (params.town) {
    qs.set('town', params.town);
  }
  if (params.type) {
    qs.set('type', params.type);
  }
  if (params.ref) {
    qs.set('ref', params.ref);
  }

  const url = `properties?${qs.toString()}`;

  const response = await $fetchP(url, {
    headers: {
      'Accept-Language': params.locale,
    },
  });
  
  if (!response.ok) return undefined;
  
  const data = (await response.json()) as Property[];
  return data;
}
