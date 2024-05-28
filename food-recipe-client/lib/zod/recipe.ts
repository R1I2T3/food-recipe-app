import { z } from "zod";

export const IngredientSchema = z.object({
  name: z.string(),
  quantity: z.string(),
});

export const createRecipeSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  instruction: z.string().min(1, { message: "Instruction is required" }),
  type: z.enum(["Veg", "NonVeg"]),
  cuisine: z.enum([
    "Thai",
    "American",
    "Chinese",
    "Mexican",
    "Indian",
    "Nepali",
    "Spanish",
  ]),
  Ingredient: z.array(IngredientSchema),
});
