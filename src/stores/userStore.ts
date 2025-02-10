import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type UserStoreActions = {
  user: {
    _id: string;
    username: string;
    avatar: string;
    friends: string[];
    isFriendsWith: string[];
  } | null;
  setUser: (user: any) => void;
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
    }
  )
);
