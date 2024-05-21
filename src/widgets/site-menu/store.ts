import { create } from 'zustand';

interface SiteMenuState {
	isOpen: boolean;
	toggle: () => void;
}

export const useSiteMenuStore = create<SiteMenuState>(set => ({
	isOpen: false,
	toggle: () => set(state => ({ isOpen: !state.isOpen }))
}));
