import { Hono } from "hono";
import { ZodValidator } from "../../helpers/ZodValidator";
import { LoginSchema, signupSchema } from "./schema";
import db from "../../config/db";
import { GenerateJwtToken } from "../../helpers/GenerateJwtToken";
import { ProtectRoute } from "../../middleware/protectRoute";
import { UploadFileToCloudinary } from "../../helpers/UploadFileToCloudinary";
import bcrypt from "bcrypt";
const route = new Hono().basePath("/auth");

route.post("/signup", ZodValidator(signupSchema, "form"), async (c) => {
  try {
    const body = await c.req.valid("form");
    let avatar_url = "";
    const { image } = await c.req.parseBody();
    if (image && image instanceof File) {
      avatar_url = await UploadFileToCloudinary(image);
    }
    const isUserPresent = await db.user.findUnique({
      where: { username: body.username },
    });
    if (isUserPresent) {
      return c.json(
        { error: "User with following username already present" },
        401
      );
    }
    const hashedPassword = await bcrypt.hash(body.password, 10);
    const newUser = await db.user.create({
      data: {
        username: body.username,
        password: hashedPassword,
        full_name: body.full_name,
        gender: body.gender,
        avatar_url: avatar_url,
      },
      select: {
        id: true,
        username: true,
        password: false,
        gender: true,
        avatar_url: true,
        createdAt: true,
      },
    });
    const token = await GenerateJwtToken(newUser.id);
    return c.json({ newUser, message: "User created", token }, 201);
  } catch (error: any) {
    console.log(error.message);
    return c.json({ error: "Internal server error" }, 500);
  }
});

route.post("/login", ZodValidator(LoginSchema, "json"), async (c) => {
  try {
    const { username, password: givenPassword } = await c.req.valid("json");
    const user = await db.user.findUnique({ where: { username } });
    if (!user) {
      return c.json({ error: "Invalid Credentials" }, 401);
    }
    const isPasswordCorrect = await bcrypt.compare(
      givenPassword,
      user.password
    );
    if (!isPasswordCorrect) {
      return c.json({ error: "Invalid Credentials" }, 401);
    }
    const { password, ...userDetails } = user;
    const token = await GenerateJwtToken(userDetails.id);
    return c.json(
      { userDetails, message: "User logged in successfully", token },
      200
    );
  } catch (error) {
    console.log(error);
    c.json({ error: "Internal server error" }, 500);
  }
});

route.post("/logout", ProtectRoute, (c) => {
  return c.json({ message: "User can Logout" });
});

export default route;
