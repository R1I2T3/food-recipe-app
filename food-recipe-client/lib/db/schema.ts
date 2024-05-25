import { appSchema, tableSchema } from "@nozbe/watermelondb";

const mySchema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: "user",
      columns: [
        { name: "user_db_id", type: "string" },
        { name: "username", type: "string" },
        { name: "full_name", type: "string" },
        { name: "avatar_url", type: "string" },
        { name: "gender", type: "string" },
        { name: "account_created_at", type: "string" },
      ],
    }),
    tableSchema({
      name: "recipes",
      columns: [
        { name: "recipe_db_id", type: "string" },
        { name: "name", type: "string" },
        { name: "instruction", type: "string" },
        { name: "type", type: "string" },
        { name: "cuisine", type: "string" },
        { name: "youtube_video_link", type: "string", isOptional: true },
        { name: "food_image_url", type: "string" },
        { name: "creatorId", type: "string" },
      ],
    }),
    tableSchema({
      name: "ingredients",
      columns: [
        { name: "ingredient_db_id", type: "string" },
        { name: "name", type: "string" },
        { name: "quantity", type: "string" },
        { name: "recipeId", type: "string" },
      ],
    }),
    tableSchema({
      name: "LikedRecipe",
      columns: [
        { name: "liked_recipe_db_id", type: "string" },
        { name: "user_id", type: "string" },
        { name: "recipe_id", type: "string" },
        { name: "liked_at", type: "string" },
      ],
    }),
  ],
});

export default mySchema;
