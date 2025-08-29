'use client';

import { create } from 'zustand';

interface MobileFilterState {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const useMobileFilterStore = create<MobileFilterState>((set) => ({
  isOpen: false,
  setIsOpen: (open) => set({ isOpen: open }),
}));
