import { FlatList } from "react-native";
import React from "react";
import RecipeCard from "./RecipeCard";
import { YStack, Text } from "tamagui";

const HomeScreenPagination = ({ item }: any) => {
  if (item.data.recipes.length === 0) {
    return (
      <YStack justifyContent="center" alignItems="center">
        <Text color={"$orange10"}>
          There is no recipe Available in this cuisine
        </Text>
      </YStack>
    );
  }
  return (
    <YStack
      backgroundColor={"$orange1"}
      flexGrow={1}
      justifyContent="flex-start"
    >
      <FlatList
        data={item.data.recipes}
        renderItem={({ item }) => <RecipeCard data={item} key={item.id} />}
      />
    </YStack>
  );
};

export default HomeScreenPagination;
