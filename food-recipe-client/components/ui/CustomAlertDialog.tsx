import { AlertDialog, Button, XStack, YStack } from "tamagui";
import React from "react";
import { Dimensions } from "react-native";
interface CustomAlertDialogPropsTypes {
  AlertButtonTriggerLabel: string;
  AlertDialogTitle: string;
  AlertDialogDescription: string;
  AlertDialogActionTitle: string;
  AlertDialogAction: ({ ...remainingArgs }) => null;
  children: React.ReactNode;
}
const CustomAlertDialog = (props: CustomAlertDialogPropsTypes) => {
  const windowWidth = Dimensions.get("window").width;

  return (
    <AlertDialog>
      <AlertDialog.Trigger asChild>{props.children}</AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Overlay
          key="overlay"
          animation="quick"
          opacity={0.5}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <AlertDialog.Content
          bordered
          elevate
          key="content"
          backgroundColor={"$orange2"}
          width={windowWidth * 0.9}
          animation={[
            "quick",
            {
              opacity: {
                overshootClamping: true,
              },
            },
          ]}
          enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
          exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
          x={0}
          scale={1}
          opacity={1}
          y={0}
          borderRadius={10}
        >
          <YStack space>
            <AlertDialog.Title fontSize={"$8"} fontWeight={"bold"}>
              {props.AlertDialogTitle}
            </AlertDialog.Title>
            <AlertDialog.Description fontSize={"$5"}>
              {props.AlertDialogDescription}
            </AlertDialog.Description>
            <XStack space="$3" justifyContent="flex-end">
              <AlertDialog.Cancel asChild>
                <Button
                  backgroundColor={"$orange9"}
                  width={windowWidth * 0.3}
                  fontSize={"$5"}
                  color={"white"}
                >
                  Cancel
                </Button>
              </AlertDialog.Cancel>
              <AlertDialog.Action asChild>
                <Button
                  theme="active"
                  backgroundColor={"$orange10"}
                  width={windowWidth * 0.3}
                  fontSize={"$5"}
                  color={"white"}
                  onPress={props.AlertDialogAction}
                >
                  {props.AlertDialogActionTitle}
                </Button>
              </AlertDialog.Action>
            </XStack>
          </YStack>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog>
  );
};

export default CustomAlertDialog;
