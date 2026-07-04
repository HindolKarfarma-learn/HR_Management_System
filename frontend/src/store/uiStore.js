import { create } from 'zustand';

export const useUiStore = create((set) => ({
  sidebarCollapsed: false,
  mobileMenuOpen: false,
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
}));
