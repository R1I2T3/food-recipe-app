import React from "react";
import { StatusBar } from "expo-status-bar";
import { XStack, Card, H2, YStack } from "tamagui";
import { Dimensions } from "react-native";
import SignUpForm from "@/components/auth/SignUpForm";

const signup = () => {
  const { width } = Dimensions.get("window");
  return (
    <YStack
      flexGrow={1}
      backgroundColor={"$orange1"}
      alignItems="center"
      justifyContent="center"
    >
      <StatusBar style="light" />
      <XStack justifyContent="center" alignItems="center">
        <Card
          w={width * 0.92}
          borderColor={"$black10"}
          borderWidth={1}
          paddingHorizontal={2}
          paddingVertical={13}
          backgroundColor={"#ffffff"}
        >
          <H2 color={"$orange10"} fontWeight={"bold"} margin={"auto"}>
            Signup
          </H2>
          <SignUpForm />
        </Card>
      </XStack>
    </YStack>
  );
};

export default signup;
