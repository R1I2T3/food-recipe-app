import { Platform } from "react-native";
import { Database } from "@nozbe/watermelondb";
import SQLiteAdapter from "@nozbe/watermelondb/adapters/sqlite";
import schema from "./schema";
import migrations from "./migration";
import User from "./model/user";

const adapter = new SQLiteAdapter({
  schema,
  migrations,
  jsi: Platform.OS === "ios",
  onSetUpError: (error) => {
    console.log(error);
  },
});

export const database = new Database({
  adapter,
  modelClasses: [User],
});

export const userCollection = database.get<User>("user");
