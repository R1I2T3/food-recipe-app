import { useMutation, useQueries, useQuery } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { useRecipeStore } from "../store";
import * as secureStore from "expo-secure-store";
import * as FileSystem from "expo-file-system";
import { useRouter } from "expo-router";
import { db } from "../db";
import { recipeTable, userTable } from "../db/schema";
import { eq } from "drizzle-orm";

export const useUpdateProfileMutation = () => {
  const { profile, fetchProfile } = useRecipeStore();
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      const token = await secureStore.getItemAsync("auth_token");
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_SERVER_URL}/user-info/update/${profile?.id}`,
        {
          method: "PUT",
          headers: {
            Bearer: token!,
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
        Toast.show({
          type: "error",
          text1: data.error,
        });
        return "error";
      }
      if (data.updateInfo) {
        let avatarImage = "";
        if (data.updateInfo.avatar_url) {
          const { uri } = await FileSystem.downloadAsync(
            data.updateInfo.avatar_url,
            FileSystem.documentDirectory +
              data.updateInfo.avatar_url.split("/").pop()
          );
          avatarImage = uri;
        }
        await db.update(userTable).set({
          full_name: data.updateInfo.full_name || profile?.full_name,
          avatar_url: avatarImage || profile?.avatar_url,
        });
      }
      Toast.show({
        type: "success",
        text1: "Account updated successfully",
      });
      await fetchProfile();
      router.dismissAll();
      return data;
    },
  });
  return mutation;
};

export const useGetUserRecipeQuery = () => {
  const { profile } = useRecipeStore();
  const query = useQuery({
    queryKey: ["MyRecipe", profile?.id],
    queryFn: async () => {
      const recipes = await db
        .select()
        .from(recipeTable)
        .where(eq(recipeTable.creatorId, profile?.id!));
      return recipes;
    },
    staleTime: 5,
  });
  return query;
};
