import { Context, Next } from "hono";
import { verify } from "hono/jwt";
import db from "../config/db";

export const ProtectRoute = async (c: Context, next: Next) => {
  try {
    const { bearer } = c.req.header();
    if (!bearer) {
      return c.json({ error: "Unauthorized access" });
    }
    let decoded;
    try {
      decoded = await verify(bearer, Bun.env.JWT_SECRET!);
    } catch (error) {
      return c.json({ error: "Invalid token" });
    }
    const user = await db.user.findUnique({ where: { id: decoded.id } });
    if (!user) {
      return c.json({ return: "Invalid token" });
    }
    c.set("jwtPayload", user);
    await next();
  } catch (error) {
    console.log(error);
    return c.json({ error: "Internal server error" });
  }
};