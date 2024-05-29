import { useMutation, useQuery } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { useRecipeStore } from "../store";
import * as secureStore from "expo-secure-store";
import { useRouter } from "expo-router";
import * as FileSystem from "expo-file-system";
import { db } from "../db";
import { SaveRecipe } from "@/utils/saveRecipe";
import { ingredientTable, recipeTable } from "../db/schema";
import { eq } from "drizzle-orm";

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
        SaveRecipe(newRecipe, profile?.id);
        Toast.show({ type: "success", text1: "Recipe added successfully" });
        router.replace("/protected/");
      }
    },
  });
  return mutation;
};

export const useGetRecipeQuery = (id: string) => {
  const { setRecipe } = useRecipeStore();
  const query = useQuery({
    queryKey: ["recipe", id],
    queryFn: async () => {
      const recipe = await db
        .select()
        .from(recipeTable)
        .where(eq(recipeTable.id, id));
      const ingredients = await db
        .select()
        .from(ingredientTable)
        .where(eq(ingredientTable.recipeId, id));
      const data = { ...recipe[0], ingredients };
      setRecipe(data);
      return data;
    },
  });
  return query;
};

export const useDeleteRecipeMutation = (id: string) => {
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: async () => {
      const token = await secureStore.getItemAsync("auth_token");
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_SERVER_URL}/recipe/delete/${id}`,
        {
          method: "DELETE",
          headers: {
            bearer: token!,
          },
        }
      );
      const data = await response.json();
      return data;
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
      await db.delete(ingredientTable).where(eq(ingredientTable.recipeId, id)),
        await db.delete(recipeTable).where(eq(recipeTable.id, id));
      Toast.show({
        type: "success",
        text1: "recipe deleted successfully",
      });
      router.dismiss(1);
    },
  });
  return mutation;
};
