import CuisineSelect from "@/components/protected/CuisineSelect";
import RecipeInstructionTextField from "@/components/protected/RecipeInstructionTextField";
import RecipeTypeRadioGroup from "@/components/protected/RecipeTypeRadioGroup";
import CustomInput from "@/components/ui/CustomInput";
import { useSelectImage } from "@/hooks/useSelectImage";
import { useRecipeStore } from "@/lib/store";
import { updateRecipeSchema } from "@/lib/zod/recipe";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { ScrollView, YStack, Label, Button, Spinner, XStack } from "tamagui";
import { z } from "zod";
import SelectRecipeImage from "@/components/protected/SelectRecipeImage";
import CustomAlertDialog from "@/components/ui/CustomAlertDialog";
import { AntDesign, FontAwesome5 } from "@expo/vector-icons";
import { useWindowDimensions } from "react-native";
import { EditIngredientDialog } from "@/components/protected/EditIngredientDialog";
import {
  objectEqual,
  ProcessDataForFormUpdate,
} from "@/utils/ChangeFieldFunction";
import {
  useAddNewIngredientMutation,
  useRemoveIngredientMutation,
} from "@/lib/api/ingredient";
import { useUpdateRecipeMutation } from "@/lib/api/recipe";

const updateRecipe = () => {
  const { recipe } = useRecipeStore();
  const { file, pickImage } = useSelectImage();
  const [resetForm, setResetForm] = useState(false);
  const width = useWindowDimensions().width;
  const previousIngredients = recipe?.Ingredient;
  const form = useForm<z.infer<typeof updateRecipeSchema>>({
    resolver: zodResolver(updateRecipeSchema),
    defaultValues: {
      name: recipe?.name,
      instruction: recipe?.instruction,
      type: recipe?.type,
      cuisine: recipe?.cuisine!,
      Ingredient: previousIngredients,
    },
  });
  const {
    mutateAsync: AddIngredientMutate,
    isPending: isAddIngredientPending,
  } = useAddNewIngredientMutation();
  const {
    mutateAsync: RemoveIngredientMutate,
    isPending: isRemoveIngredientPending,
  } = useRemoveIngredientMutation();
  // const
  const {
    mutateAsync: UpdateRecipeMutate,
    isPending: isUpdateRecipeMutationPending,
  } = useUpdateRecipeMutation();
  const onUpdateRecipeSubmit = async (
    values: z.infer<typeof updateRecipeSchema>
  ) => {
    const processedData = ProcessDataForFormUpdate(recipe, values);
    const formData = new FormData();
    if (file) {
      formData.append("image", {
        name: file?.fileName?.split(".")[0],
        uri: file?.uri,
        type: file?.mimeType,
        size: file?.fileSize,
      } as any);
    }
    for (let [key, value] of Object.entries(processedData)) {
      if (typeof value == "string") {
        formData.append(key, value);
      }
    }
    await UpdateRecipeMutate(formData);
  };
  const onAdditionIngredient = async (
    values: z.infer<typeof updateRecipeSchema>
  ) => {
    const addedIngredient = values.Ingredient?.filter(
      (ingredient) =>
        !previousIngredients.some((y: any) => objectEqual(ingredient, y))
    );
    await AddIngredientMutate({ newIngredients: addedIngredient });
  };
  const onRemoveIngredient = async (
    values: z.infer<typeof updateRecipeSchema>
  ) => {
    const removedIngredients = previousIngredients
      ?.filter(
        (ingredient: any) =>
          !values.Ingredient?.some((x: any) => objectEqual(ingredient, x))
      )
      .map((Ingredient: any) => ({ uuid: Ingredient.id }));
    await RemoveIngredientMutate({ deleteIngredientUUids: removedIngredients });
  };

  return (
    <ScrollView
      backgroundColor={"$orange1"}
      flexGrow={1}
      paddingHorizontal={10}
      paddingTop={20}
      paddingBottom={"$5"}
    >
      <FormProvider {...form}>
        <CustomInput Name="name" />
        <RecipeInstructionTextField />
        <RecipeTypeRadioGroup />
        <CuisineSelect />
        <YStack space="$4">
          <Label fontSize={"$6"} fontWeight={"bold"}>
            Edit Ingredients
          </Label>
          <XStack justifyContent="space-between">
            <EditIngredientDialog
              DialogTitle="Add Ingredients"
              DialogActionTitle="Add ingredient"
              ShowIngredientSectionAddButton={true}
              DialogAction={form.handleSubmit(onAdditionIngredient)}
              isPending={isAddIngredientPending}
            >
              <Button backgroundColor={"$orange8"} width={width * 0.45}>
                <AntDesign name="pluscircle" size={24} color="white" />
              </Button>
            </EditIngredientDialog>
            <EditIngredientDialog
              DialogTitle="Remove Ingredients"
              DialogActionTitle="remove ingredient"
              ShowIngredientSectionAddButton={false}
              DialogAction={form.handleSubmit(onRemoveIngredient)}
              isPending={isRemoveIngredientPending}
            >
              <Button
                backgroundColor={"$orange8"}
                width={width * 0.45}
                // paddingVertical={14}
              >
                <FontAwesome5 name="minus-circle" size={24} color="white" />
              </Button>
            </EditIngredientDialog>
          </XStack>
        </YStack>
      </FormProvider>
      <YStack justifyContent="center">
        <Label fontSize={"$6"} fontWeight={"bold"}>
          Recipe Image
        </Label>
        <SelectRecipeImage
          file={file}
          resetForm={resetForm}
          pickImage={pickImage}
        />
      </YStack>
      <CustomAlertDialog
        AlertButtonTriggerLabel="Update"
        AlertDialogActionTitle="Update"
        AlertDialogTitle="Update Recipe"
        AlertDialogDescription="Are you sure about  update this recipe"
        AlertDialogAction={form.handleSubmit(onUpdateRecipeSubmit)}
      >
        <Button
          marginBottom={30}
          marginTop={30}
          fontSize={"$6"}
          backgroundColor={"$orange9"}
          color={"white"}
          pressStyle={{ backgroundColor: "$orange11" }}
          disabled={isUpdateRecipeMutationPending}
        >
          {isUpdateRecipeMutationPending ? (
            <Spinner size="small" color="white" />
          ) : (
            "Update"
          )}
        </Button>
      </CustomAlertDialog>
    </ScrollView>
  );
};

export default updateRecipe;
