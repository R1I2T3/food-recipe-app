import { useMutation } from "@tanstack/react-query";
import { useRecipeStore } from "../store";
import * as secureStore from "expo-secure-store";
import Toast from "react-native-toast-message";
import { useRouter } from "expo-router";
import { db } from "../db";
import { ingredientTable, recipeTable } from "../db/schema";
import { eq, inArray } from "drizzle-orm";

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
      const Ingredient = await db
        .select()
        .from(ingredientTable)
        .where(eq(ingredientTable.recipeId, recipe?.id as string));
      const updateRecipeWithIngredients = { ...updatedRecipe[0], Ingredient };
      setRecipe(updateRecipeWithIngredients);
    },
  });
  return mutation;
};

export const useRemoveIngredientMutation = () => {
  const { recipe, setRecipe } = useRecipeStore();
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const auth_token = await secureStore.getItemAsync("auth_token");
      const response = await fetch(
        `${
          process.env.EXPO_PUBLIC_SERVER_URL
        }/ingredient/delete/${recipe?.id!}`,
        {
          method: "DELETE",
          headers: {
            "content-type": "application/json",
            Bearer: auth_token!,
          },
          body: JSON.stringify(data),
        }
      );
      const responseData = await response.json();
      return { responseData, data };
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
      if (data?.responseData.error) {
        console.log(data.responseData.error);
        if (
          data.responseData.error === "Invalid token" ||
          data.responseData.error === "Not Authorized"
        ) {
          await secureStore.deleteItemAsync("auth_token");
          router.replace("/auth/");
        }
        Toast.show({
          type: "error",
          text1: data.responseData.error,
        });
        return "error";
      }
      const uuidsArray = data.data.deleteIngredientUUids.map(
        (d: any) => d.uuid
      );
      await db
        .delete(ingredientTable)
        .where(inArray(ingredientTable.id, uuidsArray));
      const Ingredient = await db
        .select()
        .from(ingredientTable)
        .where(eq(ingredientTable.recipeId, recipe?.id as string));
      setRecipe({ ...recipe, Ingredient });
    },
  });
  return mutation;
};
