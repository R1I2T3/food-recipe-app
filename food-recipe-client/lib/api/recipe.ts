import { useMutation, useQuery, useInfiniteQuery } from "@tanstack/react-query";
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
      const auth_token = await secureStore.getItemAsync("auth_token");
      const recipe = await db
        .select()
        .from(recipeTable)
        .where(eq(recipeTable.id, id));
      const Ingredient = await db
        .select()
        .from(ingredientTable)
        .where(eq(ingredientTable.recipeId, id));

      if (recipe.length === 0) {
        const response = await fetch(
          `${process.env.EXPO_PUBLIC_SERVER_URL}/recipe/get-recipe/${id}`,
          {
            headers: {
              Bearer: auth_token!,
            },
          }
        );
        const responseData = await response.json();
        if (responseData.recipe) {
          setRecipe(responseData.recipe);
          return responseData.recipe;
        } else {
          throw Error("Some error taken place");
        }
      }
      const data = { ...recipe[0], Ingredient };
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

export const useUpdateRecipeMutation = () => {
  const router = useRouter();
  const { recipe, setRecipe } = useRecipeStore();

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      const auth_token = await secureStore.getItemAsync("auth_token");
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_SERVER_URL}/recipe/update/${recipe?.id!}`,
        {
          method: "PUT",
          headers: {
            Bearer: auth_token!,
          },
          body: data,
        }
      );
      const responseData = await response.json();
      return responseData;
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
      let food_image_url;
      console.log(data);

      if (data.updateRecipe.food_image_url) {
        const { uri: FoodImageUri } = await FileSystem.downloadAsync(
          data.food_image_url,
          FileSystem.documentDirectory + data.food_image_url.split("/").pop()
        );
        food_image_url = FoodImageUri;
      }
      if (data.updateRecipe) {
        console.log("I am here");

        await db
          .update(recipeTable)
          .set({
            name: data.updateRecipe.name || recipe?.name,
            instruction: data.updateRecipe.instruction || recipe?.instruction,
            type: data.updateRecipe.type || recipe?.type,
            cuisine: data.updateRecipe.cuisine || recipe?.cuisine,
            food_image_url: food_image_url || recipe?.food_image_url,
          })
          .where(eq(recipeTable.id, recipe?.id!));
      }
      router.dismiss(1);
      const updatedRecipe = (
        await db
          .select()
          .from(recipeTable)
          .where(eq(recipeTable.id, recipe?.id!))
      )[0];

      const Ingredient = await db
        .select()
        .from(ingredientTable)
        .where(eq(ingredientTable.recipeId, recipe?.id!));
      setRecipe({ ...updatedRecipe, Ingredient });
      Toast.show({ type: "success", text1: "recipe updated successfully" });
    },
  });
  return mutation;
};

export const useGetAllRecipeQuery = (param: string) => {
  const { profile } = useRecipeStore();
  const query = useInfiniteQuery({
    queryKey: ["recipes", profile?.id, param],
    queryFn: async ({ pageParam = 0 }) => {
      let response;
      const auth_token = await secureStore.getItemAsync("auth_token");
      if (!param) {
        response = await fetch(
          `${process.env.EXPO_PUBLIC_SERVER_URL}/recipe/get-recipes?skip=${pageParam}`,
          {
            headers: {
              Bearer: auth_token!,
            },
          }
        );
      } else {
        response = await fetch(
          `${process.env.EXPO_PUBLIC_SERVER_URL}/recipe/get-recipes?q=${param}&skip=${pageParam}`
        );
      }
      const data = await response.json();
      return {
        data,
        currentPage: pageParam,
      };
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const nextPage =
        lastPage?.data?.recipes?.length === 10
          ? allPages?.length > 0
            ? allPages[allPages?.length - 1].currentPage + 1
            : 2
          : undefined;
      return nextPage;
    },
  });
  return query;
};
