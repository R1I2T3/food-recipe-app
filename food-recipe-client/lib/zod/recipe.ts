import { z } from "zod";

export const IngredientSchema = z.object({
  id: z.string().optional(),
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

export const updateRecipeSchema = z.object({
  name: z.string().optional(),
  instruction: z.string().optional(),
  type: z.enum(["Veg", "NonVeg"]).optional(),
  cuisine: z.enum([
    "Thai",
    "American",
    "Chinese",
    "Mexican",
    "Indian",
    "Nepali",
    "Spanish",
  ]),
  Ingredient: z.array(IngredientSchema).optional(),
});
