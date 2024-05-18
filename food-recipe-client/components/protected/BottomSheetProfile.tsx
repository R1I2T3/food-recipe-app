import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Feather } from "@expo/vector-icons";
import { Sheet } from "tamagui";
import type { SheetProps } from "tamagui";
const BottomSheetProfile = (props: SheetProps) => {
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
        justifyContent="center"
        alignItems="center"
        space="$5"
      >
        <Sheet.ScrollView marginTop={"$5"}>
          <TouchableOpacity onPress={() => props.onOpenChange?.(false)}>
            <Feather
              name="arrow-down-circle"
              size={40}
              color="hsl(24, 100%, 46.5%)"
            />
          </TouchableOpacity>
        </Sheet.ScrollView>
      </Sheet.Frame>
    </Sheet>
  );
};

export default BottomSheetProfile;

const styles = StyleSheet.create({});
