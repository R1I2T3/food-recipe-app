import { Tabs } from "expo-router";
import React from "react";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { AntDesign } from "@expo/vector-icons";
import { useRecipeStore } from "@/lib/store";
import { useEffect } from "react";
const AppLayout = () => {
  const { fetchProfile } = useRecipeStore();
  useEffect(() => {
    fetchProfile();
  }, []);
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "hsl(24, 100%, 46.5%)",
        tabBarInactiveTintColor: "hsl(25, 100%, 82.8%)",
        tabBarActiveBackgroundColor: "hsl(24, 70.0%, 99.0%)",
        tabBarInactiveBackgroundColor: "hsl(24, 70.0%, 99.0%)",
        tabBarStyle: { height: 70 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="home" size={30} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="createRecipe"
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: ({ color }) => (
            <AntDesign name="pluscircle" size={30} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: ({ size, color }) => (
            <FontAwesome5 name="user-circle" size={30} color={color} />
          ),
        }}
      />
    </Tabs>
  );
};

export default AppLayout;
