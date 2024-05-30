import { Hono } from "hono";
import { ProtectRoute } from "../../middleware/protectRoute";
import { ZodValidator } from "../../helpers/ZodValidator";
import { addIngredientSchema, deleteIngredientSchema } from "./schema";
import db from "../../config/db";
import { Ingredient } from "@prisma/client";
const route = new Hono().basePath("/ingredient");

route.post(
  "/add/:id",
  ProtectRoute,
  ZodValidator(addIngredientSchema, "json"),
  async (c) => {
    try {
      const RecipeId = c.req.param("id");
      const { newIngredients } = c.req.valid("json");

      const isRecipePresent = await db.recipe.findUnique({
        where: { id: RecipeId },
      });
      if (!isRecipePresent) {
        return c.json({ error: "Wrong recipe id provided" }, 404);
      }
      newIngredients.forEach((element: any) => {
        element["recipeId"] = RecipeId;
      });
      const { id: UserId } = c.get("jwtPayload");
      if (UserId !== isRecipePresent.creatorId) {
        return c.json(
          {
            error:
              "You are not authorized for doing this Updating this recipe ingredients",
          },
          401
        );
      }
      let newSavedIngredients: any = [];
      for (let i = 0; i < newIngredients.length; i++) {
        const savedIngredient = await db.ingredient.create({
          data: newIngredients[i],
        });
        newSavedIngredients.push(savedIngredient);
      }
      // const newIngredient = await db.ingredient.createMany({
      //   data: [...newIngredients],
      // });
      return c.json(newSavedIngredients, 201);
    } catch (error) {
      console.log(error);
      return c.json({ error: "Internal server error" }, 500);
    }
  }
);

route.delete(
  "/delete/:id",
  ProtectRoute,
  ZodValidator(deleteIngredientSchema, "json"),
  async (c) => {
    try {
      const RecipeId = c.req.param("id");
      const isRecipePresent = await db.recipe.findUnique({
        where: { id: RecipeId },
      });
      if (!isRecipePresent) {
        return c.json({ error: "Wrong recipe id provided" }, 404);
      }
      const { id: UserId } = c.get("jwtPayload");
      if (UserId !== isRecipePresent.creatorId) {
        return c.json(
          { message: "You are not authorized for doing this action" },
          401
        );
      }
      const { deleteIngredientUUids } = c.req.valid("json");
      const idToDelete = deleteIngredientUUids.map(
        (deleteIngredientUUid: any) => deleteIngredientUUid.uuid
      );

      await db.ingredient.deleteMany({
        where: {
          id: {
            in: idToDelete,
          },
        },
      });
      return c.json({ message: "Ingredient deleted successfully" }, 202);
    } catch (error) {
      console.log(error);
      return c.json({ error: "Some server side error taken place" }, 500);
    }
  }
);

export default route;
