import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Button } from "tamagui";
const index = () => {
  return (
    <Button
      marginTop={100}
      backgroundColor={"$red10"}
      color={"$white10"}
      circular
    >
      Hello tamagui
    </Button>
  );
};

export default index;

const styles = StyleSheet.create({});
