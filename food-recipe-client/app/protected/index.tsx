import { Button } from "tamagui";
import React, { useEffect } from "react";
import { useRecipeStore } from "@/lib/store";
import * as secureStore from "expo-secure-store";
import User from "@/lib/db/model/user";
import Header from "@/components/protected/Header";
const Home = () => {
  const { profile, fetchProfile } = useRecipeStore((state) => ({
    profile: state.profile,
    fetchProfile: state.fetchProfile,
  }));
  useEffect(() => {
    fetchProfile();
  }, []);

  const onClickTest = async () => {
    console.log(profile);
  };
  return (
    <>
      <Header />
      <Button onPress={onClickTest}>Test</Button>
    </>
  );
};

export default Home;
