import {
  ScrollView,
  Text,
  XStack,
  Spinner,
  Image,
  View,
  YStack,
  Separator,
} from "tamagui";
import React from "react";
import { useGetRecipeQuery } from "@/lib/api/recipe";
import { useLocalSearchParams } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { useWindowDimensions } from "react-native";
import RecipeActionRow from "@/components/protected/RecipeActionRow";
import { useRecipeStore } from "@/lib/store";
import { ingredientsSelectType } from "@/lib/db/schema";
const RecipeScreen = () => {
  const { id } = useLocalSearchParams();
  const width = useWindowDimensions().width;
  const { isPending, isError, data } = useGetRecipeQuery(id as string);
  const { recipe } = useRecipeStore();
  if (!recipe || isPending) {
    return (
      <YStack
        justifyContent="center"
        alignItems="center"
        flexGrow={1}
        backgroundColor={"$orange1"}
      >
        <Spinner size="large" color="$orange10" />
      </YStack>
    );
  }
  if (isError) {
    return (
      <ScrollView
        justifyContent="center"
        alignItems="center"
        flexGrow={1}
        backgroundColor={"$orange1"}
        marginBottom={"$6"}
      >
        <MaterialIcons name="error" size={30} color="hsl(358, 75.0%, 59.0%)" />
        <Text color={"$red9"} fontSize={"$6"}>
          Some error taken place
        </Text>
      </ScrollView>
    );
  }
  return (
    <ScrollView
      backgroundColor={"$orange1"}
      flexGrow={1}
      paddingHorizontal={width - width * 0.95}
      paddingTop={20}
    >
      <Image
        src={recipe?.food_image_url!}
        width={width * 0.9}
        height={width * 0.7}
        marginBottom="$5"
      />
      <XStack justifyContent="space-between" alignItems="center">
        <View width={width * 0.55}>
          <Text
            fontSize={"$6"}
            fontWeight={"bold"}
            textOverflow="revert-layer"
            wordWrap="initial"
          >
            {recipe?.name}
          </Text>
        </View>
        <RecipeActionRow
          creatorId={recipe?.creatorId as string}
          recipeId={recipe?.id!}
        />
      </XStack>
      <YStack marginBottom="$4">
        <Text fontSize={"$6"} fontWeight={"bold"}>
          Instructions
        </Text>
        <Text fontSize={"$5"} textAlign="justify">
          {recipe?.instruction}
        </Text>
      </YStack>
      <XStack justifyContent="space-between" marginBottom="$4">
        <XStack>
          <Text fontSize={"$5"} fontWeight={"bold"}>
            Type:{" "}
          </Text>
          <Text fontSize={"$5"}>{recipe?.type}</Text>
        </XStack>
        <XStack>
          <Text fontSize={"$5"} fontWeight={"bold"}>
            Cuisine:{" "}
          </Text>
          <Text fontSize={"$5"}>{recipe?.cuisine}</Text>
        </XStack>
      </XStack>
      <YStack>
        <Text fontSize={"$6"} fontWeight={"bold"} marginBottom="$2">
          Ingredients
        </Text>
        <XStack justifyContent="space-between" marginBottom="$3">
          <Text fontSize={"$5"} fontWeight={"bold"}>
            Name
          </Text>
          <Text fontSize={"$5"} fontWeight={"bold"}>
            Quantity
          </Text>
        </XStack>
        {recipe?.Ingredient?.map((ingredient: ingredientsSelectType) => (
          <YStack key={ingredient.id}>
            <XStack justifyContent="space-between">
              <Text fontSize={"$5"}>{ingredient.name}</Text>
              <Text fontSize={"$5"}>{ingredient.quantity}</Text>
            </XStack>
            <Separator
              alignSelf="stretch"
              marginVertical={15}
              borderColor={"$orange10"}
            />
          </YStack>
        ))}
      </YStack>
    </ScrollView>
  );
};

export default RecipeScreen;
