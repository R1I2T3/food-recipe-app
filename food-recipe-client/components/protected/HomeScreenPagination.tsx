import { FlatList, StyleSheet, Text, View } from "react-native";
import React from "react";
import RecipeCard from "./RecipeCard";
import { YStack } from "tamagui";

const HomeScreenPagination = ({ item }: any) => {
  return (
    <YStack backgroundColor={"$orange1"}>
      <FlatList
        data={item.data.recipes}
        renderItem={({ item }) => <RecipeCard data={item} key={item.id} />}
      />
    </YStack>
  );
};

export default HomeScreenPagination;

const styles = StyleSheet.create({});
