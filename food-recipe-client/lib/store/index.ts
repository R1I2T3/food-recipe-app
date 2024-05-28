import { create } from "zustand";
import * as secureStore from "expo-secure-store";
import {
  userInsertType,
  userSelectType,
  userTable,
  recipeSelectType,
  recipeTable,
} from "../db/schema";
import { db } from "../db";
import { eq } from "drizzle-orm";
interface useRecipeStoreTypes {
  isAuthenticated: boolean;
  setIsAuthenticated: (arg: boolean) => void;
  profile: userSelectType | null;
  setProfile: (user: userInsertType) => void;
  fetchProfile: () => Promise<void>;
  recipes: recipeSelectType[] | [];
  fetchRecipes: (id: string | undefined) => Promise<void>;
  setRecipes: (recipes: recipeSelectType[] | []) => void;
}
export const useRecipeStore = create<useRecipeStoreTypes>((set) => ({
  isAuthenticated: secureStore.getItem("auth_token") !== undefined,
  setIsAuthenticated: (args: boolean) => set({ isAuthenticated: args }),
  profile: null,
  fetchProfile: async () => {
    try {
      const userProfileData = await db.select().from(userTable);
      set({ profile: userProfileData[0] });
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  },
  setProfile: (user: userInsertType) => set({ profile: user }),
  recipes: [],
  fetchRecipes: async (id) => {
    try {
      if (id) {
        const userRecipes = await db
          .select()
          .from(recipeTable)
          .where(eq(recipeTable.creatorId, id));
        set({ recipes: userRecipes });
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  },
  setRecipes: (recipes) => {
    if (recipes) {
      set({ recipes });
    } else {
      set({ recipes: [] });
    }
  },
}));
