import { SafeAreaView, TouchableOpacity } from "react-native";
import React from "react";
import { Avatar, XStack, YStack, Text } from "tamagui";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import EditProfileForm from "@/components/protected/EditProfileForm";
const EditProfile = () => {
  const router = useRouter();
  return (
    <YStack
      backgroundColor={"$orange1"}
      paddingVertical={30}
      paddingHorizontal={10}
      flexGrow={1}
    >
      <XStack justifyContent="space-between" alignItems="center">
        <TouchableOpacity onPress={() => router.dismissAll()}>
          <Feather
            name="arrow-left-circle"
            size={34}
            color="hsl(24, 100%, 46.5%)"
          />
        </TouchableOpacity>
        <Text fontSize={"$7"}>Edit Profile</Text>
      </XStack>
      <EditProfileForm />
    </YStack>
  );
};

export default EditProfile;
