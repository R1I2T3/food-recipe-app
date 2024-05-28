import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { Feather } from "@expo/vector-icons";
import { Sheet, Spinner, XStack, YStack } from "tamagui";
import type { SheetProps } from "tamagui";
import { useGetUserRecipeQuery } from "@/lib/api/user";
import { FlatList } from "react-native";
import RecipeCard from "./RecipeCard";
import { db } from "@/lib/db";
import { recipeTable } from "@/lib/db/schema";
import { count, eq } from "drizzle-orm";
import { useRecipeStore } from "@/lib/store";
const MyRecipeBottomSheetProfile = (props: SheetProps) => {
  const { profile } = useRecipeStore();
  const [recipeLength, setRecipeLength] = useState(2);
  let recipe_length;
  const getRecipeLength = async () => {
    const fetchedData = await db
      .select({ count: count() })
      .from(recipeTable)
      .where(eq(recipeTable.creatorId, profile.id!));
    setRecipeLength(fetchedData[0].count);
  };
  getRecipeLength();
  const { data, isPending, isError } = useGetUserRecipeQuery(
    profile?.id,
    recipeLength
  );
  if (isPending) {
    return (
      <YStack justifyContent="center" alignItems="center">
        <XStack>
          <Spinner />
        </XStack>
      </YStack>
    );
  }
  return (
    <Sheet
      animation="medium"
      modal
      snapPoints={[90]}
      dismissOnSnapToBottom
      {...props}
    >
      <Sheet.Overlay
        animation="medium"
        enterStyle={{ opacity: 0 }}
        exitStyle={{ opacity: 0 }}
      />
      <Sheet.Handle />
      <Sheet.Frame
        flex={1}
        space="$5"
        paddingHorizontal={"$5"}
        backgroundColor={"$orange2"}
      >
        <YStack margin="auto" paddingVertical={6}>
          <TouchableOpacity onPress={() => props.onOpenChange?.(false)}>
            <Feather
              name="arrow-down-circle"
              size={40}
              color="hsl(24, 100%, 46.5%)"
            />
          </TouchableOpacity>
        </YStack>
        {isPending ? (
          <YStack justifyContent="center" alignItems="center">
            <XStack>
              <Spinner />
            </XStack>
          </YStack>
        ) : null}
        {isError ? (
          <YStack justifyContent="center" alignItems="center">
            <XStack>
              <Text>Error while fetching recipes</Text>
            </XStack>
          </YStack>
        ) : null}
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <RecipeCard
              data={item}
              key={item.id}
              setSheetState={props.onOpenChange}
            />
          )}
          showsVerticalScrollIndicator={false}
        />
      </Sheet.Frame>
    </Sheet>
  );
};

export default MyRecipeBottomSheetProfile;

const styles = StyleSheet.create({});
