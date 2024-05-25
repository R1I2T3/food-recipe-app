import { useMutation } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { useRecipeStore } from "../store";
import * as secureStore from "expo-secure-store";
import { useRouter } from "expo-router";
import { database, recipeCollection, ingredientsCollection } from "../db";
import * as FileSystem from "expo-file-system";

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
        await database.write(async () => {
          const NewRecipe = await recipeCollection.create((recipe) => {
            (recipe.RecipeId = "12"), (recipe.name = newRecipe.name);
            recipe.type = newRecipe.type;
            recipe.cuisine = newRecipe.cuisine;
            recipe.youtube_video_link = newRecipe.youtube_video_link || "";
            recipe.food_image_url = FoodImageUri;
            recipe.creator.set(profile);
          });
          newRecipe.Ingredient.forEach(async (value: any) => {
            await ingredientsCollection.create((ingredient) => {
              ingredient.IngredientName = value.name;
              ingredient.recipe.set(NewRecipe);
              ingredient.quantity = value.quantity;
              ingredient.ingredientId = value.id;
            });
          });
        });
        Toast.show({ type: "success", text1: "Recipe added successfully" });
        router.replace("/protected/");
      }
    },
  });
  return mutation;
};
