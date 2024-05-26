import { TouchableOpacity } from "react-native";
import { XStack, Text } from "tamagui";
import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as secureStore from "expo-secure-store";
import { useRecipeStore } from "@/lib/store";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { db } from "@/lib/db";
import {
  ingredientTable,
  LikedRecipeTable,
  recipeTable,
  userTable,
} from "@/lib/db/schema";
const Header = () => {
  const setIsAuthenticated = useRecipeStore(
    (state) => state.setIsAuthenticated
  );
  const router = useRouter();
  const LogOut = async () => {
    try {
      await secureStore.deleteItemAsync("auth_token");
      await db.delete(LikedRecipeTable);
      await db.delete(ingredientTable);
      await db.delete(recipeTable);
      await db.delete(userTable);
      setIsAuthenticated(false);
      router.replace("/auth/");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <SafeAreaView>
      <StatusBar style="light" backgroundColor="hsl(24, 94.0%, 50.0%)" />
      <XStack
        paddingTop={5}
        paddingBottom={20}
        paddingHorizontal={10}
        backgroundColor={"$orange9"}
        alignItems="center"
        justifyContent="space-between"
      >
        <Text color={"#fff"} fontSize={"$9"} fontStyle="italic">
          Recipe
        </Text>
        <TouchableOpacity onPress={LogOut}>
          <MaterialIcons name="logout" size={24} color="#fff" />
        </TouchableOpacity>
      </XStack>
    </SafeAreaView>
  );
};

export default Header;
