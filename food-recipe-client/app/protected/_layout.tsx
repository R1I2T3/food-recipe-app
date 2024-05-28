import {
  StyleSheet,
  TouchableNativeFeedback,
  TouchableOpacityBase,
} from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { Button, Text } from "tamagui";
import { useRouter } from "expo-router";
const RootLayout = () => {
  const router = useRouter();
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="editProfile"
        options={{ headerShown: false, presentation: "modal" }}
      />
      <Stack.Screen
        name="recipe/[id]"
        options={{
          animation: "fade",
          title: "Recipe",
          headerStyle: { backgroundColor: "hsl(24, 94.0%, 50.0%)" },
          headerTintColor: "white",
          headerTitleAlign: "center",
          headerTitleStyle: { fontSize: 25 },
          headerBackButtonMenuEnabled: true,
          headerBlurEffect: "systemChromeMaterial",
          headerLeft: () => {
            return (
              <Button
                onPress={() => router.dismiss(1)}
                circular
                backgroundColor={"$orange8"}
                pressStyle={{ backgroundColor: "$orange7" }}
              >
                <AntDesign name="back" size={25} color="white" />
              </Button>
            );
          },
        }}
      />
    </Stack>
  );
};

export default RootLayout;

const styles = StyleSheet.create({});
