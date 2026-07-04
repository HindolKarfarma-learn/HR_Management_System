import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setSession: ({ user, token }) => {
        localStorage.setItem('hrms-token', token);
        set({ user, token, isAuthenticated: true });
      },
      clearSession: () => {
        localStorage.removeItem('hrms-token');
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    {
      name: 'peopleflow-session',
      partialize: ({ user, token, isAuthenticated }) => ({ user, token, isAuthenticated }),
    },
  ),
);
