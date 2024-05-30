import { Redirect } from "expo-router";
import { useRecipeStore } from "@/lib/store";
import { db } from "@/lib/db";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import migrations from "@/lib/db/migrations/migrations";
import { View, Text } from "react-native";
const index = () => {
  const { success, error } = useMigrations(db, migrations);
  const isAuthenticated = useRecipeStore((state) => state.isAuthenticated);

  if (isAuthenticated) {
    return Redirect({ href: "/protected/" });
  } else {
    return Redirect({ href: "/auth/" });
  }
};

export default index;
