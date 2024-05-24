import { Platform } from "react-native";
import { Database } from "@nozbe/watermelondb";
import SQLiteAdapter from "@nozbe/watermelondb/adapters/sqlite";
import schema from "./schema";
import migrations from "./migration";
import User from "./model/user";
import Recipe from "./model/recipe";
import Ingredients from "./model/ingredients";

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
  modelClasses: [User, Recipe, Ingredients],
});

export const userCollection = database.get<User>("user");
export const recipeCollection = database.get<Recipe>("recipes");
export const ingredientsCollection = database.get<Ingredients>("ingredients");
