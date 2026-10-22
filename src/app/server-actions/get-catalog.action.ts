'use server';

import { $fetchP } from '../server-api';
import { Property } from '@/src/shared/types';
import { convertEurToTon } from '@/src/shared/utils/ton-converter';
import { fetchPropertyTypeGroupPage } from '@/src/shared/utils/property-type-group-fetch';

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

  // A grouped type filter is resolved by merging one request per member type,
  // because the API only understands a single exact `type` value.
  const order = params.order ?? 'asc';

  let data: Property[];

  try {
    const result = await fetchPropertyTypeGroupPage({
      type: params.type,
      page: Number(params.page) || 1,
      order,
      fetchPage: async ({ type, page }) => {
        const qs = new URLSearchParams();

        qs.set('page', String(page));
        qs.set('order', order === 'desc' ? '-price' : 'price');

        if (params.province) qs.set('province', params.province);
        if (params.town) qs.set('town', params.town);
        if (type) qs.set('type', type);
        if (params.ref) qs.set('ref', params.ref);

        const response = await $fetchP(`properties?${qs.toString()}`, {
          headers: {
            'Accept-Language': params.locale,
          },
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        return (await response.json()) as Property[];
      },
    });

    data = result.items;
  } catch (error) {
    console.warn('[getCatalog] Failed to load properties:', error);
    return undefined;
  }

  // Convert EUR prices to TON
  try {
    const propertiesWithTon = await Promise.all(
      data.map(async (property) => {
        if (property.price && property.currency === 'EUR') {
          try {
            property.price_ton = await convertEurToTon(property.price);
          } catch {}
        }
        return property;
      })
    );

    return propertiesWithTon;
  } catch (error) {
    console.warn('[getCatalog] Failed to convert prices to TON:', error);
    return data;
  }
}
