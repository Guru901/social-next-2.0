import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type User = {
  _id: string;
  username: string;
  avatar: string;
  friends: string[];
  isFriendsWith: string[];
};

type UserStoreActions = {
  user: User | null;
  setUser: (user: User) => void;
};

export const useUserStore = create<UserStoreActions>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
