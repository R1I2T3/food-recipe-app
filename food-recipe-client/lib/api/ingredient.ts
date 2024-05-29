import { useMutation } from "@tanstack/react-query";
import { useRecipeStore } from "../store";
import * as secureStore from "expo-secure-store";
import Toast from "react-native-toast-message";
import { useRouter } from "expo-router";
import { db } from "../db";
import { ingredientTable, recipeTable } from "../db/schema";
import { eq } from "drizzle-orm";

export const useAddNewIngredientMutation = () => {
  const { recipe, setRecipe } = useRecipeStore();
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const auth_token = await secureStore.getItemAsync("auth_token");
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_SERVER_URL}/ingredient/add/${recipe?.id}`,
        {
          method: "POST",
          headers: {
            Bearer: auth_token!,
            "content-type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      const ResponseData = await response.json();
      return ResponseData;
    },
    onError: (error) => {
      console.log(error);
      Toast.show({
        type: "error",
        text1: "some server side error taken place",
      });
      return "error";
    },
    onSuccess: async (data) => {
      if (data?.error) {
        console.log(data.error);
        if (data.error === "Invalid token" || data.error === "Not Authorized") {
          await secureStore.deleteItemAsync("auth_token");
          router.replace("/auth/");
        }
        Toast.show({
          type: "error",
          text1: data.error,
        });
        return "error";
      }
      for (let i = 0; i < data.length; i++) {
        await db.insert(ingredientTable).values(data);
      }
      const updatedRecipe = await db
        .select()
        .from(recipeTable)
        .where(eq(recipeTable.id, recipe?.id as string));
      const ingredients = await db
        .select()
        .from(ingredientTable)
        .where(eq(ingredientTable.recipeId, recipe?.id as string));
      const updateRecipeWithIngredients = { ...updatedRecipe[0], ingredients };
      setRecipe(updateRecipeWithIngredients);
    },
  });
  return mutation;
};
