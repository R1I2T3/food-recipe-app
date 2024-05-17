import { userCollection, database } from "@/lib/db";
import * as FileSystem from "expo-file-system";
import * as secureStore from "expo-secure-store";

export const SaveUser = async (values: any) => {
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
    await database.write(async () => {
      await userCollection.create((newUser) => {
        newUser.UserId = values.userDetails.id;
        newUser.username = values.userDetails.username;
        newUser.fullName = values.userDetails.full_name;
        newUser.gender = values.userDetails.gender;
        newUser.createdAt = values.userDetails.createdAt;
        newUser.avatar_url = avatarImage;
      });
    });
    return "success";
  } catch (error) {
    console.log("error");
    return "failure";
  }
};
