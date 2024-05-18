import { Button } from "tamagui";
import React, { useEffect } from "react";
import { useRecipeStore } from "@/lib/store";
import * as secureStore from "expo-secure-store";
import { useRouter } from "expo-router";
import { database, userCollection } from "@/lib/db";
import User from "@/lib/db/model/user";
const Home = () => {
  const setIsAuthenticated = useRecipeStore(
    (state) => state.setIsAuthenticated
  );
  const router = useRouter();
  const { profile, fetchProfile } = useRecipeStore((state) => ({
    profile: state.profile,
    fetchProfile: state.fetchProfile,
  }));
  useEffect(() => {
    fetchProfile();
  }, []);
  const LogOut = async () => {
    console.log("Button clicked");
    await secureStore.deleteItemAsync("auth_token");
    setIsAuthenticated(false);
    router.replace("/auth/");
  };
  const onClickTest = async () => {
    console.log(profile);
  };
  return (
    <>
      <Button onPress={LogOut} margin={100}>
        Logout
      </Button>
      <Button onPress={onClickTest}>Test</Button>
    </>
  );
};

export default Home;
