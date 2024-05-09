import { Hono } from "hono";
import { ProtectRoute } from "../../middleware/protectRoute";
import db from "../../config/db";
import { ZodValidator } from "../../helpers/ZodValidator";
import { updateProfileSchema } from "./schema";
import { v2 as cloudinary } from "cloudinary";
import { UploadFileToCloudinary } from "../../helpers/UploadFileToCloudinary";

const route = new Hono().basePath("/user-info");

route.get("/profile/:id", ProtectRoute, async (c) => {
  try {
    const id = c.req.param("id");
    const user = await db.user.findUnique({
      where: { id },
      select: {
        password: false,
        username: true,
        full_name: true,
        avatar_url: true,
        gender: true,
        createdAt: true,
      },
    });
    if (!user) {
      return c.json({ error: "There is No user With this id" });
    }
    return c.json({ user }, 200);
  } catch (error) {
    console.log(error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

route.put(
  "/update/:id",
  ProtectRoute,
  ZodValidator(updateProfileSchema, "form"),
  async (c) => {
    try {
      const {
        id: userID,
        avatar_url: current_profile_pic,
        password: oldPassword,
        full_name: Old_fullName,
      } = c.get("jwtPayload");
      const profileId = c.req.param("id");
      if (userID !== profileId) {
        return c.json({
          error: "You are not allowed for doing such operation",
        });
      }
      const { image } = await c.req.parseBody();
      const body = c.req.valid("form");
      let new_image_url = "";
      let newPassword = "";
      if (image && image instanceof File) {
        if (current_profile_pic) {
          cloudinary.uploader.destroy(
            current_profile_pic.split("/").pop().split(".")[0]
          );
          new_image_url = await UploadFileToCloudinary(image);
        }
      }
      if (body.password) {
        newPassword = await Bun.password.hash(body.password);
      }
      const updatedUser = await db.user.update({
        where: { id: userID },
        data: {
          avatar_url: new_image_url || current_profile_pic,
          password: newPassword || oldPassword,
          full_name: body.full_name || Old_fullName,
        },
        select: {
          password: false,
          username: true,
          full_name: true,
          avatar_url: true,
          gender: true,
          createdAt: true,
        },
      });
      return c.json(
        { message: "Account updated successfully", updatedUser },
        202
      );
    } catch (error) {
      return c.json({ error: "Some server side error taken place" }, 500);
    }
  }
);

export default route;