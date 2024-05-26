import {
  TouchableHighlight,
  TouchableNativeFeedback,
  useWindowDimensions,
} from "react-native";
import React from "react";
import Recipe from "@/lib/db/model/recipe";
import { Card, Image, XStack, YStack, Text } from "tamagui";
const RecipeCard = ({ data }: { data: Recipe }) => {
  const width = useWindowDimensions().width;
  const imageUrl = data.food_image_url;
  const onPressRecipeCard = () => {
    console.log("recipeCard is pressed");
  };
  return (
    <TouchableNativeFeedback onPress={onPressRecipeCard}>
      <Card
        width={width * 0.8}
        margin="auto"
        backgroundColor={"$orange2"}
        bordered
        space="$4"
        marginBottom="$4"
        borderColor={"black"}
        borderBottomColor={"white"}
      >
        <Image
          src={imageUrl}
          height={width * 0.5}
          width={width * 0.65}
          marginHorizontal="auto"
          marginTop="$3"
          borderRadius={10}
        />
        <YStack
          backgroundColor={"$orange10"}
          flexGrow={1}
          space="$3"
          padding="$4"
        >
          <XStack justifyContent="space-between">
            <Text
              color={"white"}
              fontSize={"$6"}
              fontStyle="italic"
              fontWeight={"bold"}
            >
              Name:
            </Text>
            <Text color={"white"} fontSize={"$6"}>
              {data.name}
            </Text>
          </XStack>
          <XStack justifyContent="space-between">
            <XStack>
              <Text color={"white"} fontSize={"$5"}>
                Type:{" "}
              </Text>
              <Text color={"white"} fontSize={"$5"}>
                {data.type}
              </Text>
            </XStack>
            <XStack>
              <Text color={"white"} fontSize={"$5"}>
                Cuisine:{" "}
              </Text>
              <Text color={"white"} fontSize={"$5"}>
                {data.cuisine}
              </Text>
            </XStack>
          </XStack>
        </YStack>
      </Card>
    </TouchableNativeFeedback>
  );
};

export default RecipeCard;
