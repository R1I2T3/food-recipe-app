import { Hono } from "hono";
import { ProtectRoute } from "../../middleware/protectRoute";
import db from "../../config/db";

const route = new Hono().basePath("/favourite");

route.post("/add-favourite/:id", ProtectRoute, async (c) => {
  try {
    const { id: userId } = c.get("jwtPayload");
    const recipeId = c.req.param("id");
    const isRecipePresent = await db.recipe.findUnique({
      where: { id: recipeId },
    });
    if (!isRecipePresent) {
      return c.json({ error: "Following recipe id is wrong" }, 401);
    }
    const isUserAlreadyLikedRecipe = await db.likedRecipe.findFirst({
      where: { userId, recipeId },
    });
    if (isUserAlreadyLikedRecipe) {
      return c.json({ error: "You already liked this recipe" }, 200);
    }
    const newLikedRecipe = await db.likedRecipe.create({
      data: { userId, recipeId },
    });
    return c.json({ newLikedRecipe }, 201);
  } catch (error) {
    console.log(error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

route.delete("/delete-favourite/:id", ProtectRoute, async (c) => {
  try {
    const { id: UserId } = c.get("jwtPayload");
    const favouriteId = c.req.param("id");
    const getFavourite = await db.likedRecipe.findUnique({
      where: { id: favouriteId },
    });
    if (!getFavourite) {
      return c.json({ error: "Please Provide correct recipe id" }, 400);
    }
    if (getFavourite.userId !== UserId) {
      return c.json(
        { error: "You are not authorized to perform this action" },
        401
      );
    }
    await db.likedRecipe.delete({ where: { id: favouriteId } });
    return c.json({ message: "Recipe removed from favourite successfully" });
  } catch (error) {
    console.log(error);
    c.json({ error: "Internal server error" }, 500);
  }
});

route.get("/get-favourite-recipes/:id", ProtectRoute, async (c) => {
  try {
    const { skip: skipQueryParam } = c.req.query();
    if (!skipQueryParam) {
      return c.json({ error: "Please provide query param" }, 400);
    }
    const skip = parseInt(skipQueryParam);
    const userID = c.req.param("id");
    const likedRecipe = await db.likedRecipe.findMany({
      skip: skip * 10,
      take: 10,
      where: { userId: userID },
      include: {
        LikedRecipe: {
          select: {
            food_image_url: true,
            name: true,
            type: true,
          },
        },
      },
    });
    return c.json({ likedRecipe }, 200);
  } catch (error) {
    console.log(error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

export default route;
