import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Feather } from "@expo/vector-icons";
import { Sheet, Spinner, XStack, YStack } from "tamagui";
import type { SheetProps } from "tamagui";
import { useGetUserRecipeQuery } from "@/lib/api/user";
import { MaterialIcons } from "@expo/vector-icons";
import { FlatList } from "react-native";
import Recipe from "@/lib/db/model/recipe";
import RecipeCard from "./RecipeCard";
const MyRecipeBottomSheetProfile = (props: SheetProps) => {
  const { data, isPending, isError } = useGetUserRecipeQuery();
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
          renderItem={({ item }) => <RecipeCard data={item} key={item.id} />}
          showsVerticalScrollIndicator={false}
        />
      </Sheet.Frame>
    </Sheet>
  );
};

export default MyRecipeBottomSheetProfile;

const styles = StyleSheet.create({});
