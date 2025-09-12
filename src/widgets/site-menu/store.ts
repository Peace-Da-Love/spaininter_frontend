import { create } from 'zustand';

interface SiteMenuState {
	isOpen: boolean;
	toggle: (force?: boolean) => void;
}

export const useSiteMenuStore = create<SiteMenuState>(set => ({
	isOpen: false,
	toggle: (force) =>
		set((state) => ({
		isOpen: typeof force === 'boolean' ? force : !state.isOpen,
		})),
}));