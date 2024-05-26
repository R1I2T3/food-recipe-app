import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import { type InferSelectModel, type InferInsertModel } from "drizzle-orm";
export const userTable = sqliteTable("user", {
  id: text("id").primaryKey(),
  username: text("username").notNull(),
  full_name: text("full_name").notNull(),
  avatar_url: text("avatar_url").notNull(),
  gender: text("gender").$type<"Male" | "Female" | "Other">().notNull(),
  createdAt: text("created_at").notNull(),
});

export const recipeTable = sqliteTable("recipes", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  instruction: text("instruction").notNull(),
  type: text("type").notNull().$type<"Veg" | "NonVeg">(),
  cuisine: text("cuisine").notNull(),
  food_image_url: text("food_image_url").notNull(),
  creatorId: text("creator_id").references(() => userTable.id),
});

export const ingredientTable = sqliteTable("ingredients", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  quantity: text("quantity").notNull(),
  recipeId: text("recipe_id").references(() => recipeTable.id),
});

export const LikedRecipeTable = sqliteTable("liked_recipe", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => userTable.id),
  likedRecipeId: text("recipe_id").references(() => recipeTable.id),
});

export type userInsertType = InferInsertModel<typeof userTable>;
export type userSelectType = InferSelectModel<typeof userTable>;
export type recipeInsertType = InferInsertModel<typeof recipeTable>;
export type recipeSelectType = InferSelectModel<typeof recipeTable>;
export type ingredientsInsertType = InferInsertModel<typeof ingredientTable>;
export type ingredientsSelectType = InferSelectModel<typeof ingredientTable>;
export type likedRecipeInsertType = InferInsertModel<typeof LikedRecipeTable>;
export type likedRecipeSelectType = InferSelectModel<typeof LikedRecipeTable>;
