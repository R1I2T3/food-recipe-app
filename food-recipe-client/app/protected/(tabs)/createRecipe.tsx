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
        <YStack>
          <Label fontSize={"$6"} fontWeight={"bold"}>
            Name *
          </Label>
          <Controller
            control={form.control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
                backgroundColor={"#ffffff"}
                borderColor={"$orange9"}
                placeholder="Enter name of recipe"
                borderWidth={1}
                focusStyle={{ borderColor: "$orange10", borderWidth: 1 }}
              />
            )}
            name="name"
          />
          {form.formState.errors.name && (
            <H3 color={"$red10"} fontSize={13}>
              {form.formState.errors.name.message}
            </H3>
          )}
        </YStack>
        <YStack>
          <Label fontSize={"$6"} fontWeight={"bold"}>
            Instructions *
          </Label>
          <Controller
            name="instruction"
            control={form.control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextArea
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
                placeholder="Enter recipe details"
                paddingTop={0}
                backgroundColor={"#ffffff"}
                borderColor={"$orange9"}
                borderWidth={1}
                focusStyle={{ borderColor: "$orange10", borderWidth: 1 }}
              />
            )}
          />
          {form.formState.errors.instruction && (
            <H3 color={"$red10"} fontSize={13}>
              {form.formState.errors.instruction.message}
            </H3>
          )}
        </YStack>
        <YStack>
          <XStack alignItems="center" space="$10">
            <Label fontSize={"$6"} fontWeight={"bold"}>
              Type *:
            </Label>
            <Controller
              control={form.control}
              name="type"
              render={({ field: { onChange, value } }) => (
                <RecipeTypeRadioGroup onChange={onChange} value={value} />
              )}
            />
          </XStack>
          {form.formState.errors.type && (
            <H3 color={"$red10"} fontSize={13}>
              {form.formState.errors.type.message}
            </H3>
          )}
        </YStack>
        <YStack>
          <Label fontSize={"$6"} fontWeight={"bold"}>
            Cuisine *
          </Label>
          <Controller
            name="cuisine"
            control={form.control}
            render={({ field: { onChange, value } }) => (
              <CuisineSelect onChange={onChange} value={value} />
            )}
          />
          {form.formState.errors.cuisine && (
            <H3 color={"$red10"} fontSize={13}>
              {form.formState.errors.cuisine.message}
            </H3>
          )}
        </YStack>
        <YStack>
          <Label fontSize={"$6"} fontWeight={"bold"}>
            Ingredients
          </Label>
          <FormProvider {...form}>
            <IngredientSection />
          </FormProvider>
        </YStack>
        <YStack>
          <Label fontSize={"$6"} fontWeight={"bold"}>
            Youtube video link
          </Label>
          <Controller
            name="youtube_video_link"
            control={form.control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                onBlur={onBlur}
                value={value}
                onChangeText={onChange}
                backgroundColor={"#ffffff"}
                borderColor={"$orange9"}
                placeholder="Enter name of recipe"
                borderWidth={1}
                focusStyle={{ borderColor: "$orange10", borderWidth: 1 }}
              />
            )}
          />
        </YStack>
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
