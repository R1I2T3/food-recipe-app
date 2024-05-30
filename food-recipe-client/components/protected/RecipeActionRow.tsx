import { Button, Spinner, XStack } from "tamagui";
import React, { useEffect, useState } from "react";
import { useRecipeStore } from "@/lib/store";
import { Feather } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import CustomAlertDialog from "../ui/CustomAlertDialog";
import { useDeleteRecipeMutation } from "@/lib/api/recipe";
import { likedRecipeSelectType } from "@/lib/db/schema";
import { useAddNewIngredientMutation } from "@/lib/api/ingredient";
import {
  useAddFavouriteMutation,
  useRemoveFavouriteMutation,
} from "@/lib/api/Favourite";
const RecipeActionRow = ({
  creatorId,
  recipeId,
}: {
  creatorId: string;
  recipeId: string;
}) => {
  const { profile, FavouriteRecipes, fetchFavourite } = useRecipeStore();
  const [isRecipeFavourite, setRecipeFavourite] = useState(false);
  const router = useRouter();
  const { mutateAsync: DeleteRecipeMutate, isPending: isDeletingPending } =
    useDeleteRecipeMutation(recipeId);
  const { mutateAsync: AddToLikeMutate, isPending: isAddToFavouritePending } =
    useAddFavouriteMutation();
  const {
    mutateAsync: RemoveFavourite,
    isPending: isRemoveFromFavouritePending,
  } = useRemoveFavouriteMutation();
  const onDelete = async () => {
    await DeleteRecipeMutate();
  };
  useEffect(() => {
    const FavouriteRecipeId = FavouriteRecipes?.map(
      (FavouriteRecipe: likedRecipeSelectType) => FavouriteRecipe.likedRecipeId
    );

    setRecipeFavourite(FavouriteRecipeId?.includes(recipeId)!);
  }, []);
  console.log(isRecipeFavourite);

  const onAddFavourite = async () => {
    await AddToLikeMutate(recipeId);
    setRecipeFavourite(true);
  };
  const onRemoveFavourite = async () => {
    try {
      const FavouriteRecipe = FavouriteRecipes?.filter(
        (favourite) => favourite.likedRecipeId === recipeId
      );
      await RemoveFavourite(FavouriteRecipe[0]?.id!);
      setRecipeFavourite(false);
    } catch (error) {
      console.log(error);
    }
  };
  return profile?.id === creatorId ? (
    <XStack space="$2" alignItems="center">
      <Button
        backgroundColor={"white"}
        borderColor={"$orange9"}
        onPress={() => router.push("/protected/updaterecipe/")}
      >
        <Feather name="edit" size={24} color="hsl(152, 57.5%, 37.6%)" />
      </Button>
      {isDeletingPending ? (
        <Spinner color={"$red10"} size="large" />
      ) : (
        <CustomAlertDialog
          AlertButtonTriggerLabel="Delete"
          AlertDialogActionTitle="Delete"
          AlertDialogTitle="Delete"
          AlertDialogDescription="Are you sure about deleting this recipe"
          AlertDialogAction={onDelete}
        >
          <Button backgroundColor={"white"} borderColor={"$orange9"}>
            <MaterialCommunityIcons
              name="delete"
              size={24}
              color="hsl(358, 75.0%, 59.0%)"
            />
          </Button>
        </CustomAlertDialog>
      )}
    </XStack>
  ) : (
    <>
      {isRecipeFavourite ? (
        <Button
          borderColor={"$orange9"}
          backgroundColor={"white"}
          onPress={onRemoveFavourite}
        >
          {isRemoveFromFavouritePending ? (
            <Spinner color={"$orange10"} />
          ) : (
            <MaterialIcons name="favorite" size={24} color="red" />
          )}
        </Button>
      ) : (
        <Button
          borderColor={"$orange9"}
          backgroundColor={"white"}
          onPress={onAddFavourite}
        >
          {isAddToFavouritePending ? (
            <Spinner color={"$orange10"} />
          ) : (
            <MaterialIcons name="favorite-border" size={24} color="black" />
          )}
        </Button>
      )}
    </>
  );
};

export default RecipeActionRow;
