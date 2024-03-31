import { create } from 'zustand';
import { Filter, News } from '@/src/shared/types';

interface NewsFilterState {
	category: Filter;
	setCategory: (category: Filter) => void;
	count: number;
	setCount: (count: number) => void;
	page: number;
	setPage: (page: number) => void;
	limit: number;
	setLimit: (limit: number) => void;
	news: News[];
	setNews: (news: News[]) => void;
}

export const useNewsFilterStore = create<NewsFilterState>()(set => ({
	category: 'latest',
	setCategory: (category: Filter) => set({ category }),
	count: 50,
	setCount: (count: number) => set({ count }),
	page: 1,
	setPage: (page: number) => set({ page }),
	limit: 10,
	setLimit: (limit: number) => set({ limit }),
	news: [],
	setNews: (news: News[]) => set({ news })
}));
