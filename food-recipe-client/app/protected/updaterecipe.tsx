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
import {
  ScrollView,
  YStack,
  Label,
  Button,
  Spinner,
  XStack,
  Text,
} from "tamagui";
import { z } from "zod";
import SelectRecipeImage from "@/components/protected/SelectRecipeImage";
import CustomAlertDialog from "@/components/ui/CustomAlertDialog";
import { AntDesign, FontAwesome5 } from "@expo/vector-icons";
import { useWindowDimensions } from "react-native";
import { EditIngredientDialog } from "@/components/protected/EditIngredientDialog";
import { ingredientsSelectType } from "@/lib/db/schema";

const updateRecipe = () => {
  const { recipe } = useRecipeStore();
  const { file, pickImage } = useSelectImage();
  const [resetForm, setResetForm] = useState(false);
  const width = useWindowDimensions().width;
  const previousIngredients = recipe?.ingredients?.map(
    (ingredient: ingredientsSelectType) => ({
      name: ingredient.name,
      quantity: ingredient.quantity,
    })
  );
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
  const isPending = false;
  const onSubmit = () => {};
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
              DialogAction={() => {}}
            >
              <Button backgroundColor={"$orange8"} width={width * 0.45}>
                <AntDesign name="pluscircle" size={24} color="white" />
              </Button>
            </EditIngredientDialog>
            <EditIngredientDialog
              DialogTitle="Remove Ingredients"
              DialogActionTitle="remove ingredient"
              ShowIngredientSectionAddButton={false}
              DialogAction={() => {}}
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
        AlertDialogAction={form.handleSubmit(onSubmit)}
      >
        <Button
          marginBottom={30}
          marginTop={30}
          fontSize={"$6"}
          backgroundColor={"$orange9"}
          color={"white"}
          pressStyle={{ backgroundColor: "$orange11" }}
          // disabled={isPending}
        >
          {isPending ? <Spinner size="small" color="white" /> : "Update"}
        </Button>
      </CustomAlertDialog>
    </ScrollView>
  );
};

export default updateRecipe;
