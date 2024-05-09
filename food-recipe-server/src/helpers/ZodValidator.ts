import { validator } from "hono/validator";
import { Context } from "hono";
import { Schema } from "zod";

export const ZodValidator = (schema: Schema, type: any) =>
  validator(type, (value, c: Context) => {
    const parsedValue = schema.safeParse(value);
    if (!parsedValue.success) {
      return c.json({ error: "Invalid input data provided" }, 400);
    }
    return parsedValue.data;
  });
