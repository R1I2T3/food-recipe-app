import { sign } from "hono/jwt";

export const GenerateJwtToken = async (id: String) => {
  const token = await sign(
    { id, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 2 }, //2 days
    Bun.env.JWT_SECRET!
  );
  return token;
};
