import { z } from "zod";
import { IngredientSchema } from "../recipe/schema";

export const addIngredientSchema = z.object({
  newIngredients: z.array(IngredientSchema),
});

const deleteIngredient = z.object({ uuid: z.string().uuid() });
export const deleteIngredientSchema = z.object({
  deleteIngredientUUids: z.array(deleteIngredient),
});
