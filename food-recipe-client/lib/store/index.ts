import { create } from "zustand";
import * as secureStore from "expo-secure-store";
import {
  userInsertType,
  userSelectType,
  userTable,
  recipeSelectType,
  likedRecipeSelectType,
  LikedRecipeTable,
} from "../db/schema";
import { db } from "../db";
import { eq } from "drizzle-orm";
interface useRecipeStoreTypes {
  isAuthenticated: boolean;
  setIsAuthenticated: (arg: boolean) => void;
  profile: userSelectType | null;
  setProfile: (user: userInsertType) => void;
  fetchProfile: () => Promise<void>;
  recipe: recipeSelectType | null;
  setRecipe: (recipe: recipeSelectType) => void;
  FavouriteRecipes: likedRecipeSelectType[] | null;
  fetchFavourite: (id: string) => void;
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
  recipe: null,
  setRecipe: (recipe) => set({ recipe }),
  FavouriteRecipes: null,
  fetchFavourite: async (id) => {
    const favouriteRecipes = await db
      .select()
      .from(LikedRecipeTable)
      .where(eq(LikedRecipeTable.userId, id));
    set({ FavouriteRecipes: favouriteRecipes });
  },
}));
