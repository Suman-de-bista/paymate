import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  email: string;
}

interface UserState {
  user: User | null;
  isLoggedIn: boolean;
  login: (user: User) => void;
  logout: () => void;
}

const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isLoggedIn: false,
      login: (user) => set({ user, isLoggedIn: true }),
      logout: () => set({ user: null, isLoggedIn: false }),
    }),
    {
      name: 'user-storage',
      storage: {
        getItem: (name) => {
          const stored = localStorage.getItem(name);
          return stored ? JSON.parse(stored) : null; // Custom deserialization
        },
        setItem: (name, value) => {
          localStorage.setItem(name, JSON.stringify(value)); // Custom serialization
        },
        removeItem: (name) => {
          localStorage.removeItem(name);
        },
      }
    }
  )
);
export default useUserStore;