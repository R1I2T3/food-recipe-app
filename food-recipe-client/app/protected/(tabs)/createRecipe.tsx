import React, { useState } from "react";
import Header from "@/components/protected/Header";
import { createRecipeSchema } from "@/lib/zod/recipe";
import { useForm } from "react-hook-form";
import {
  Spinner,
  YStack,
  XStack,
  Text,
  Label,
  Button,
  ScrollView,
} from "tamagui";
import { FontAwesome } from "@expo/vector-icons";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import RecipeTypeRadioGroup from "@/components/protected/RecipeTypeRadioGroup";
import CuisineSelect from "@/components/protected/CuisineSelect";
import SelectRecipeImage from "@/components/protected/SelectRecipeImage";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useSelectImage } from "@/hooks/useSelectImage";
import IngredientSection from "@/components/protected/IngredientSection";
import { FormProvider } from "react-hook-form";
import CustomInput from "@/components/ui/CustomInput";
import RecipeInstructionTextField from "@/components/protected/RecipeInstructionTextField";
import Toast from "react-native-toast-message";
import { useCreateRecipeMutation } from "@/lib/api/recipe";
const createRecipe = () => {
  const { file, pickImage } = useSelectImage();
  const [resetForm, setResetForm] = useState(false);
  const form = useForm<z.infer<typeof createRecipeSchema>>({
    resolver: zodResolver(createRecipeSchema),
    defaultValues: {
      name: "",
      instruction: "",
      type: "Veg",
      cuisine: "Thai",
      youtube_video_link: "",
      Ingredient: [{ name: "", quantity: "" }],
    },
  });
  const { isPending, mutateAsync: CreateRecipeMutate } =
    useCreateRecipeMutation();
  const tabBarHeight = useBottomTabBarHeight();
  const onSubmit = async (values: z.infer<typeof createRecipeSchema>) => {
    const formData = new FormData();
    if (!file) {
      Toast.show({ type: "error", text1: "Please select a recipe image" });
    }
    formData.append("image", {
      name: file?.fileName?.split(".")[0],
      uri: file?.uri,
      type: file?.mimeType,
      size: file?.fileSize,
    } as any);
    for (let [key, value] of Object.entries(values)) {
      if (key === "Ingredient") {
        value = JSON.stringify(value);
      }
      if (typeof value == "string") {
        formData.append(key, value);
      }
    }
    try {
      await CreateRecipeMutate(formData);
      setResetForm(true);
      form.reset();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <Header />
      <ScrollView backgroundColor={"$orange1"} padding={10} flexGrow={1}>
        <XStack
          justifyContent="space-between"
          alignItems="center"
          paddingVertical={"$3"}
        >
          <Text fontSize={"$8"}>Share a Recipe</Text>
          <FontAwesome
            name="share-square"
            size={28}
            color="hsl(24, 100%, 46.5%)"
          />
        </XStack>
        <FormProvider {...form}>
          <CustomInput Name="name" />
          <RecipeInstructionTextField />
          <RecipeTypeRadioGroup />
          <CuisineSelect />
          <IngredientSection />
          <CustomInput Name="youtube_video_link" />
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
        <Button
          marginBottom={tabBarHeight}
          marginTop={30}
          fontSize={"$6"}
          backgroundColor={"$orange9"}
          color={"white"}
          pressStyle={{ backgroundColor: "$orange11" }}
          onPress={form.handleSubmit(onSubmit)}
          disabled={isPending}
        >
          {isPending ? <Spinner size="small" color="white" /> : "Submit"}
        </Button>
      </ScrollView>
    </>
  );
};

export default createRecipe;
