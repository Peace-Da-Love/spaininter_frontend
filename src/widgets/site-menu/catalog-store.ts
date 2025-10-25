import { create } from 'zustand';

interface CatalogMenuState {
	isOpen: boolean;
	toggle: (force?: boolean) => void;
}

export const useCatalogMenuStore = create<CatalogMenuState>(set => ({
	isOpen: false,
	toggle: (force) =>
		set((state) => ({
		isOpen: typeof force === 'boolean' ? force : !state.isOpen,
		})),
}));
