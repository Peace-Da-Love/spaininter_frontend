import { Property } from '@/src/shared/types';
import {
  PROPERTY_TYPE_GROUP_MEMBERS,
  propertyTypeGroupFromQuery,
} from './property-type-group';

export const PROPERTY_PAGE_SIZE = 12;

type FetchPage = (params: {
  type: string;
  page: number;
}) => Promise<Property[]>;

function priceOf(property: Property): number {
  const price = Number(property.price);
  return Number.isFinite(price) ? price : 0;
}

/**
 * The API filters by a single exact `type` and ignores comma-separated lists,
 * so a group (e.g. all house-like types) has to be assembled client-side.
 *
 * Each member type is already returned sorted by price, so the merged list is
 * produced with a k-way merge: we pull pages per type only until we have enough
 * items to cover the requested page, instead of downloading every property.
 */
export async function fetchPropertyTypeGroupPage(params: {
  type?: string;
  page: number;
  order: 'asc' | 'desc';
  fetchPage: FetchPage;
}): Promise<{ items: Property[]; hasMore: boolean }> {
  const { type, page, order, fetchPage } = params;
  const group = propertyTypeGroupFromQuery(type);

  // Not a group (single type or no filter): the API can serve it directly.
  if (!group) {
    const items = await fetchPage({ type: type ?? '', page });
    return { items, hasMore: items.length >= PROPERTY_PAGE_SIZE };
  }

  const members = PROPERTY_TYPE_GROUP_MEMBERS[group];
  const needed = page * PROPERTY_PAGE_SIZE;

  // Per-member buffers, filled lazily one API page at a time.
  const buffers: Property[][] = members.map(() => []);
  const nextPage = members.map(() => 1);
  const exhausted = members.map(() => false);

  async function ensure(index: number): Promise<void> {
    if (buffers[index].length > 0 || exhausted[index]) return;

    const chunk = await fetchPage({
      type: members[index],
      page: nextPage[index],
    });

    nextPage[index] += 1;
    if (chunk.length < PROPERTY_PAGE_SIZE) exhausted[index] = true;
    buffers[index] = chunk;
  }

  await Promise.all(members.map((_, index) => ensure(index)));

  const merged: Property[] = [];
  const seen = new Set<Property['_id']>();

  // Take one extra item to detect whether a further page exists.
  while (merged.length <= needed) {
    let best = -1;

    for (let i = 0; i < members.length; i += 1) {
      if (!buffers[i].length) continue;
      if (best === -1) {
        best = i;
        continue;
      }

      const candidate = priceOf(buffers[i][0]);
      const current = priceOf(buffers[best][0]);
      const wins = order === 'desc' ? candidate > current : candidate < current;
      if (wins) best = i;
    }

    if (best === -1) break; // every member is drained

    const item = buffers[best].shift() as Property;
    if (!seen.has(item._id)) {
      seen.add(item._id);
      merged.push(item);
    }

    await ensure(best);
  }

  const start = (page - 1) * PROPERTY_PAGE_SIZE;
  const items = merged.slice(start, start + PROPERTY_PAGE_SIZE);

  return { items, hasMore: merged.length > start + items.length };
}
