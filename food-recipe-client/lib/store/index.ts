import { create } from "zustand";
import * as secureStore from "expo-secure-store";
import User from "../db/model/user";
import { userCollection } from "../db";
interface useRecipeStoreTypes {
  isAuthenticated: boolean;
  setIsAuthenticated: (arg: boolean) => void;
  profile: User | null;
  setProfile: (user: User) => void;
}
export const useRecipeStore = create<useRecipeStoreTypes>((set) => ({
  isAuthenticated: secureStore.getItem("auth_token") !== undefined,
  setIsAuthenticated: (args: boolean) => set({ isAuthenticated: args }),
  profile: null,
  fetchProfile: async () => {
    try {
      const userProfileData = (await userCollection.query().fetch())[0];
      set({ profile: userProfileData });
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  },
  setProfile: (user: User) => set({ profile: user }),
}));
