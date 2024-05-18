import React from "react";
import { XStack, Separator, Text, YStack } from "tamagui";

interface ProfileRowTypes {
  name: string;
  value: string | undefined;
}
const ProfileRow = ({ name, value }: ProfileRowTypes) => {
  return (
    <YStack>
      <XStack alignItems="center" justifyContent="space-between">
        <Text fontSize={"$6"} fontWeight={"bold"}>
          {name}
        </Text>
        <Text fontSize={"$6"} fontWeight={"normal"}>
          {value}
        </Text>
      </XStack>
      <Separator
        alignSelf="stretch"
        marginVertical={15}
        borderColor={"$orange7"}
      />
    </YStack>
  );
};

export default ProfileRow;
