import { useMutation, useQuery } from "@tanstack/react-query";
import { useRecipeStore } from "../store";
import * as secureStore from "expo-secure-store";
import Toast from "react-native-toast-message";
import { useRouter } from "expo-router";
import { db } from "../db";
import { LikedRecipeTable } from "../db/schema";
import { eq } from "drizzle-orm";
export const useAddFavouriteMutation = () => {
  const { fetchFavourite, profile } = useRecipeStore();
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: async (id: string) => {
      const auth_token = await secureStore.getItemAsync("auth_token");
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_SERVER_URL}/favourite/add-favourite/${id}`,
        {
          method: "POST",
          headers: {
            Bearer: auth_token!,
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
      if (data.newLikedRecipe) {
        await db.insert(LikedRecipeTable).values({
          id: data.newLikedRecipe.id,
          userId: profile?.id,
          likedRecipeId: data.newLikedRecipe.recipeId,
        });
        fetchFavourite(profile?.id!);
      }
    },
  });
  return mutation;
};

export const useRemoveFavouriteMutation = () => {
  const router = useRouter();
  const { fetchFavourite, profile } = useRecipeStore();
  const mutation = useMutation({
    mutationFn: async (id: string) => {
      const auth_token = await secureStore.getItemAsync("auth_token");
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_SERVER_URL}/favourite/delete-favourite/${id}`,
        {
          method: "DELETE",
          headers: {
            Bearer: auth_token!,
          },
        }
      );
      const data = await response.json();
      data.id = id;
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
      await db.delete(LikedRecipeTable).where(eq(LikedRecipeTable.id, data.id));
      fetchFavourite(profile?.id!);
    },
  });
  return mutation;
};

export const useGetFavouriteRecipeQuery = () => {
  const { profile } = useRecipeStore();
  const query = useQuery({
    queryKey: ["favourite-recipe", profile?.id],
    queryFn: async () => {
      const auth_token = await secureStore.getItemAsync("auth_token");
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_SERVER_URL}/favourite/get-favourite-recipes/${profile?.id}`,
        {
          headers: {
            Bearer: auth_token!,
          },
        }
      );
      const responseData = await response.json();
      return responseData;
    },
  });
  return query;
};
