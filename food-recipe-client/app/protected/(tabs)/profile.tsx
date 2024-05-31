import { TouchableOpacity } from "react-native";
import React, { useState } from "react";
import Header from "@/components/protected/Header";
import { Avatar, Text, YStack, XStack, Separator } from "tamagui";
import Feather from "@expo/vector-icons/Feather";
import { useRecipeStore } from "@/lib/store";
import ProfileRow from "@/components/protected/ProfileRow";
import { getRelativeTime } from "@/utils";
import { MaterialIcons } from "@expo/vector-icons";
import MyRecipeBottomSheetProfile from "@/components/protected/MyRecipeBottomSheetProfile";
import { Link } from "expo-router";
import FavouriteRecipeBottomSheetProfile from "@/components/protected/FavoruiteRecipeBottomSheet";
const Profile = () => {
  const { profile, fetchProfile } = useRecipeStore((state) => ({
    profile: state.profile,
    fetchProfile: state.fetchProfile,
  }));
  const [sheetOpen, setSheetOpen] = useState(false);
  const [openFavouriteSheet, setOpenFavouriteSheet] = useState(false);
  return (
    <>
      <Header />
      <YStack padding={10} backgroundColor={"$orange1"} flexGrow={1}>
        <XStack
          justifyContent="space-between"
          alignItems="center"
          paddingVertical={"$3"}
        >
          <Text fontSize={"$8"}>Profile</Text>
          <Link href={"/protected/editProfile"}>
            <Feather name="edit" size={28} color="hsl(24, 100%, 46.5%)" />
          </Link>
        </XStack>
        <XStack justifyContent="center" marginBottom={"$5"}>
          <Avatar circular size={"$10"}>
            <Avatar.Image src={profile?.avatar_url} />
            <Avatar.Fallback />
          </Avatar>
        </XStack>
        <ProfileRow name="Username" value={profile?.username} />
        <ProfileRow name="Full Name" value={profile?.full_name} />
        <ProfileRow name="Gender" value={profile?.gender} />
        <ProfileRow
          name="Date of join"
          value={getRelativeTime(profile?.createdAt!)}
        />
        <XStack
          justifyContent="space-between"
          alignItems="center"
          marginBottom={"$1"}
        >
          <Text fontSize={"$6"} fontWeight={"bold"}>
            Your recipes
          </Text>
          <TouchableOpacity onPress={() => setSheetOpen(true)}>
            <Feather
              name="arrow-right-circle"
              size={30}
              color="hsl(24, 100%, 46.5%)"
            />
            <MyRecipeBottomSheetProfile
              open={sheetOpen}
              onOpenChange={setSheetOpen}
            />
          </TouchableOpacity>
        </XStack>
        <Separator
          alignSelf="stretch"
          marginVertical={15}
          borderColor={"$orange7"}
        />
        <XStack
          marginBottom="$3"
          justifyContent="space-between"
          alignItems="center"
        >
          <Text fontSize={"$6"} fontWeight={"bold"}>
            Your favourite recipes
          </Text>
          <TouchableOpacity onPress={() => setOpenFavouriteSheet(true)}>
            <MaterialIcons
              name="favorite"
              size={30}
              color="hsl(24, 100%, 46.5%)"
            />
            <FavouriteRecipeBottomSheetProfile
              open={openFavouriteSheet}
              onOpenChange={setOpenFavouriteSheet}
            />
          </TouchableOpacity>
        </XStack>
      </YStack>
    </>
  );
};

export default Profile;
