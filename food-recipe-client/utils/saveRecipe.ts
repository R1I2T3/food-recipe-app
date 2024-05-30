import * as FileSystem from "expo-file-system";
import { db } from "@/lib/db";
import { recipeTable, ingredientTable } from "@/lib/db/schema";
import { ingredientsInsertType } from "@/lib/db/schema";
export const SaveRecipe = async (data: any, id: any) => {
  try {
    const { uri: FoodImageUri } = await FileSystem.downloadAsync(
      data.food_image_url,
      FileSystem.documentDirectory + data.food_image_url.split("/").pop()
    );

    const recipe = await db
      .insert(recipeTable)
      .values({
        id: data.id,
        name: data.name,
        type: data.type,
        cuisine: data.cuisine,
        food_image_url: FoodImageUri,
        creatorId: id!,
        instruction: data.instruction,
      })
      .returning({ id: recipeTable.id });
    await data.Ingredient.forEach(async (value: ingredientsInsertType) => {
      await db.insert(ingredientTable).values({
        id: value.id,
        name: value.name,
        quantity: value.quantity,
        recipeId: recipe[0].id,
      });
    });
  } catch (error) {
    console.log(error);
  }
};
