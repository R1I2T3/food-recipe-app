import { z } from "zod";

const IngredientSchema = z.object({
  name: z.string(),
  quantity: z.coerce.number(),
});

export const createRecipeSchema = z.object({
  name: z.string(),
  instruction: z.string(),
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
  youtube_video_link: z.string().optional(),
  Ingredient: z.array(IngredientSchema),
});
