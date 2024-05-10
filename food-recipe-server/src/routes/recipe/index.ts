import { Hono } from "hono";
import { ProtectRoute } from "../../middleware/protectRoute";
import { ZodValidator } from "../../helpers/ZodValidator";
import { createRecipeSchema } from "./schema";
import { UploadFileToCloudinary } from "../../helpers/UploadFileToCloudinary";
import db from "../../config/db";

const route = new Hono().basePath("/recipe");

route.post(
  "/create",
  ProtectRoute,
  ZodValidator(createRecipeSchema, "form"),
  async (c) => {
    try {
      const validatedData = c.req.valid("form");
      const { image } = await c.req.parseBody();
      if (!image || !(image instanceof File)) {
        return c.json({ error: "Please provide image of food item" }, 400);
      }
      const food_image_url = await UploadFileToCloudinary(image);
      const { id: UserId } = c.get("jwtPayload");
      const newRecipe = await db.recipe.create({
        data: {
          name: validatedData.name,
          instruction: validatedData.instruction,
          type: validatedData.type,
          cuisine: validatedData.cuisine,
          creatorId: UserId,
          food_image_url,
          Ingredient: {
            create: [...validatedData.Ingredient],
          },
        },
        include: {
          Ingredient: true,
        },
      });
      return c.json({ newRecipe }, 201);
    } catch (error) {
      console.log(error);
      return c.json({ error: "Internal server side error" }, 500);
    }
  }
);

route.get("/get-recipe/:id", ProtectRoute, async (c) => {
  try {
    const RecipeId = c.req.param("id");
    const recipe = await db.recipe.findUnique({
      where: { id: RecipeId },
      include: {
        Ingredient: true,
        creator: { select: { avatar_url: true, username: true } },
      },
    });
    if (!recipe) {
      return c.json({ error: "Wrong recipe id provided" }, 401);
    }
    return c.json({ recipe, success: true }, 200);
  } catch (error) {
    console.log(error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

export default route;
