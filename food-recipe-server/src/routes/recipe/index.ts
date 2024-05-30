import { Hono } from "hono";
import { ProtectRoute } from "../../middleware/protectRoute";
import { ZodValidator } from "../../helpers/ZodValidator";
import { createRecipeSchema, updateRecipeSchema } from "./schema";
import { UploadFileToCloudinary } from "../../helpers/UploadFileToCloudinary";
import db from "../../config/db";
import { v2 as cloudinary } from "cloudinary";
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

route.delete("/delete/:id", ProtectRoute, async (c) => {
  try {
    const recipeId = c.req.param("id");
    const { id: UserId } = c.get("jwtPayload");
    const recipe = await db.recipe.findUnique({
      where: { id: recipeId },
      select: { creatorId: true, food_image_url: true },
    });
    if (!recipe) {
      return c.json({ error: "Wrong recipe id provided" }, 401);
    }
    if (recipe.creatorId !== UserId) {
      return c.json({ error: "You are not authorized of this action" }, 402);
    }
    Promise.all([
      cloudinary.uploader.destroy(
        recipe.food_image_url.split("/").pop()?.split(".")[0]
      ),
      db.ingredient.deleteMany({ where: { recipeId } }),
    ])
      .then(async () => {
        await db.recipe.delete({ where: { id: recipeId } });
      })
      .catch((err) => {
        console.log(err);
        return c.json({ error: "Failed to delete recipe" }, 500);
      });
    return c.json({ message: "Recipe deleted successfully" }, 202);
  } catch (error) {
    console.log(error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

route.put(
  "/update/:id",
  ProtectRoute,
  ZodValidator(updateRecipeSchema, "form"),
  async (c) => {
    try {
      const recipeId = c.req.param("id");
      const { id: UserId } = c.get("jwtPayload");
      const recipe = await db.recipe.findUnique({
        where: { id: recipeId },
        select: { creatorId: true, food_image_url: true },
      });
      if (!recipe) {
        return c.json({ error: "Wrong recipe id provided" }, 401);
      }
      if (recipe.creatorId !== UserId) {
        return c.json({ error: "You are not authorized of this action" }, 402);
      }
      const validatedData = c.req.valid("form");
      const { image } = await c.req.parseBody();
      let new_food_image_url;
      if (image && image instanceof File) {
        if (recipe.food_image_url) {
          await cloudinary.uploader.destroy(
            recipe.food_image_url.split("/").pop()?.split(".")[0]!
          );
        }
        new_food_image_url = await UploadFileToCloudinary(image);
      }
      const updateRecipe = await db.recipe.update({
        where: { id: recipeId },
        data: {
          food_image_url: new_food_image_url || recipe.food_image_url,
          ...validatedData,
        },
        select: {
          name: validatedData.name ? true : false,
          instruction: validatedData.instruction ? true : false,
          food_image_url: new_food_image_url ? true : false,
          type: validatedData.type ? true : false,
          cuisine: validatedData.cuisine ? true : false,
        },
      });
      return c.json({ updateRecipe }, 202);
    } catch (error) {
      console.log(error);
      return c.json({ error: "Internal server error" }, 500);
    }
  }
);

route.get("/get-recipes", ProtectRoute, async (c) => {
  try {
    const { skip: skipQueryParam, ...query } = c.req.query();
    if (!skipQueryParam) {
      return c.json({ error: "Please provide skip query param" }, 400);
    }
    const recipes = await db.recipe.findMany({
      skip: parseInt(skipQueryParam) * 10,
      take: 10,
      where: { ...query },
      select: { food_image_url: true, name: true, type: true },
    });
    return c.json({ recipes }, 200);
  } catch (error) {
    console.log(error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

export default route;
