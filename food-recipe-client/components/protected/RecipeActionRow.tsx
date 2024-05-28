import { Button, Spinner, XStack } from "tamagui";
import React from "react";
import { useRecipeStore } from "@/lib/store";
import { Feather } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import CustomAlertDialog from "../ui/CustomAlertDialog";
import { useDeleteRecipeMutation } from "@/lib/api/recipe";
const RecipeActionRow = ({
  creatorId,
  recipeId,
}: {
  creatorId: string;
  recipeId: string;
}) => {
  const { profile } = useRecipeStore();
  const router = useRouter();
  const { mutateAsync: DeleteRecipeMutate, isPending: isDeletingPending } =
    useDeleteRecipeMutation(recipeId);
  const onDelete = async () => {
    await DeleteRecipeMutate();
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
      <Button borderColor={"$orange9"} backgroundColor={"white"}>
        <MaterialIcons name="favorite-border" size={24} color="black" />
      </Button>
    </>
  );
};

export default RecipeActionRow;
