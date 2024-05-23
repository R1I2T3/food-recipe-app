import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Stack } from "expo-router";

const RootLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="editProfile"
        options={{ headerShown: false, presentation: "modal" }}
      />
    </Stack>
  );
};

export default RootLayout;

const styles = StyleSheet.create({});
