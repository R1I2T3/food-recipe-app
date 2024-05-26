import { useMutation } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { useRecipeStore } from "../store";
import * as secureStore from "expo-secure-store";
import { useRouter } from "expo-router";
import * as FileSystem from "expo-file-system";
import { db } from "../db";
import {
  ingredientsInsertType,
  ingredientTable,
  recipeTable,
} from "../db/schema";

export const useCreateRecipeMutation = () => {
  const { profile } = useRecipeStore();
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      const auth_token = await secureStore.getItemAsync("auth_token");

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_SERVER_URL}/recipe/create`,
        {
          method: "POST",
          headers: {
            Bearer: auth_token!,
          },
          body: data,
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
      if (data.newRecipe) {
        const { newRecipe } = data;

        const { uri: FoodImageUri } = await FileSystem.downloadAsync(
          newRecipe.food_image_url,
          FileSystem.documentDirectory +
            newRecipe.food_image_url.split("/").pop()
        );
        const recipe = (
          await db
            .insert(recipeTable)
            .values({
              id: newRecipe.id,
              name: newRecipe.name,
              type: newRecipe.type,
              cuisine: newRecipe.cuisine,
              food_image_url: newRecipe.food_image_url,
              creatorId: profile?.id!,
              instruction: newRecipe.instruction,
            })
            .returning({ id: recipeTable.id })
        )[0];
        newRecipe.Ingredient.forEach(async (value: ingredientsInsertType) => {
          await db.insert(ingredientTable).values({
            id: value.id,
            name: value.name,
            quantity: value.quantity,
            recipeId: recipe.id,
          });
        });
        Toast.show({ type: "success", text1: "Recipe added successfully" });
        router.replace("/protected/");
      }
    },
  });
  return mutation;
};
