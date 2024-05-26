import { useRecipeStore } from "@/lib/store";
import * as FileSystem from "expo-file-system";
import * as secureStore from "expo-secure-store";
import { useRouter } from "expo-router";
import { db } from "@/lib/db";
import { userTable } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
export const useSaveUser = () => {
  const { setProfile, setIsAuthenticated } = useRecipeStore();
  const router = useRouter();
  const SaveUser = async (values: any) => {
    if (values === "error") {
      return "failure";
    }
    try {
      if (secureStore.getItem("auth_token")) {
        await secureStore.deleteItemAsync("auth_token");
      }
      await secureStore.setItemAsync("auth_token", values.token);
      const { uri: avatarImage } = await FileSystem.downloadAsync(
        values.userDetails.avatar_url,
        FileSystem.documentDirectory +
          values.userDetails.avatar_url.split("/").pop()
      );
      const { userDetails } = values;
      await db.insert(userTable).values({
        id: userDetails.id,
        username: userDetails.username,
        full_name: userDetails.full_name,
        gender: userDetails.gender,
        createdAt: userDetails.createdAt,
        avatar_url: avatarImage,
      });
      const createdUser = await db
        .select()
        .from(userTable)
        .where(eq(userTable.id, userDetails.id));
      setProfile(createdUser[0]);
      setIsAuthenticated(true);
      router.replace("/protected/");
      return "success";
    } catch (error) {
      console.log(error);
      return "failure";
    }
  };
  return { SaveUser };
};
