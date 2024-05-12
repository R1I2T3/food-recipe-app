import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { Redirect } from "expo-router";

const index = () => {
  const [auth, setAuth] = useState(false);
  if (auth) {
    return Redirect({ href: "/protected/" });
  } else {
    return Redirect({ href: "/auth/" });
  }
  return (
    <View>
      <Text>index</Text>
    </View>
  );
};

export default index;

const styles = StyleSheet.create({});
