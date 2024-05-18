import { TouchableOpacity } from "react-native";
import { XStack, Text } from "tamagui";
import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { database, userCollection } from "@/lib/db";
import * as secureStore from "expo-secure-store";
import { useRecipeStore } from "@/lib/store";
const Header = () => {
  const setIsAuthenticated = useRecipeStore(
    (state) => state.setIsAuthenticated
  );
  const router = useRouter();
  const LogOut = async () => {
    try {
      await secureStore.deleteItemAsync("auth_token");
      await database.write(async () => {
        (await userCollection.query().fetch())[0].destroyPermanently();
      });
      setIsAuthenticated(false);
      router.replace("/auth/");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <XStack
      paddingVertical={20}
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
  );
};

export default Header;