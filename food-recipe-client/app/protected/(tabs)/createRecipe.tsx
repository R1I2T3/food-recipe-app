import React, { useState } from "react";
import Header from "@/components/protected/Header";
import { createRecipeSchema } from "@/lib/zod/recipe";
import { useForm, Controller } from "react-hook-form";
import {
  Spinner,
  YStack,
  XStack,
  Text,
  Label,
  Input,
  TextArea,
  Button,
  ScrollView,
  H3,
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
const createRecipe = () => {
  const [isPending, setIsPending] = useState(true);
  const { file, pickImage } = useSelectImage();
  const form = useForm<z.infer<typeof createRecipeSchema>>({
    resolver: zodResolver(createRecipeSchema),
    defaultValues: {
      name: "",
      instruction: "",
      type: "Veg",
      cuisine: "Indian",
      youtube_video_link: "",
      Ingredient: [{ name: "", quantity: "" }],
    },
  });
  const tabBarHeight = useBottomTabBarHeight();
  const onSubmit = (values: z.infer<typeof createRecipeSchema>) => {
    console.log(values);
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
          <SelectRecipeImage file={file} pickImage={pickImage} />
        </YStack>
        <Button
          marginBottom={tabBarHeight}
          marginTop={30}
          fontSize={"$6"}
          backgroundColor={"$orange9"}
          color={"white"}
          pressStyle={{ backgroundColor: "$orange11" }}
          onPress={form.handleSubmit(onSubmit)}
        >
          Submit
        </Button>
      </ScrollView>
    </>
  );
};

export default createRecipe;
