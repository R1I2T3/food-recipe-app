import React from "react";
import { StatusBar } from "expo-status-bar";
import { XStack, Card, H2, YStack } from "tamagui";
import { Dimensions } from "react-native";
import { LoginForm } from "@/components/auth/LoginForm";
const Login = () => {
  const { width } = Dimensions.get("window");
  return (
    <YStack
      flexGrow={1}
      backgroundColor={"$orange2"}
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
          backgroundColor={"#ffff"}
        >
          <H2 color={"$orange10"} fontWeight={"bold"} margin={"auto"}>
            Login
          </H2>
          <LoginForm />
        </Card>
      </XStack>
    </YStack>
  );
};

export default Login;
