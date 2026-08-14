import { create } from 'zustand';

interface AuthStore {
  user: any | null;
  setUser: (user: any | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  isLoading: false,
  setIsLoading: (isLoading) => set({ isLoading }),
}));
