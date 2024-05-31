import { Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { Feather } from "@expo/vector-icons";
import { Sheet, Spinner, XStack, YStack } from "tamagui";
import type { SheetProps } from "tamagui";
import { FlatList } from "react-native";
import RecipeCard from "./RecipeCard";
import { useGetFavouriteRecipeQuery } from "@/lib/api/Favourite";
const FavouriteRecipeBottomSheetProfile = (props: SheetProps) => {
  const { isPending, data, isError } = useGetFavouriteRecipeQuery();
  const LikedRecipeData = data?.likedRecipe?.map((likedRecipe: any) => ({
    ...likedRecipe?.LikedRecipe,
    LikedId: likedRecipe.id,
    id: likedRecipe.recipeId,
  }));

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
          data={LikedRecipeData}
          keyExtractor={(item) => item.LikedId}
          renderItem={({ item }) => (
            <RecipeCard
              data={item}
              key={item.LikedId}
              setSheetState={props.onOpenChange}
            />
          )}
          showsVerticalScrollIndicator={false}
        />
      </Sheet.Frame>
    </Sheet>
  );
};

export default FavouriteRecipeBottomSheetProfile;
