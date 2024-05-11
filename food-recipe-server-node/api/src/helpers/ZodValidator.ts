import { validator } from "hono/validator";
import { Context } from "hono";
import { Schema } from "zod";

export const ZodValidator = (schema: Schema, type: any) =>
  validator(type, (value, c: Context) => {
    if (value.Ingredient) {
      value.Ingredient = eval(`(${value.Ingredient})`);
    }
    const parsedValue = schema.safeParse(value);
    if (!parsedValue.success) {
      console.log(parsedValue.error);

      return c.json({ error: "Invalid input data provided" }, 400);
    }
    return parsedValue.data;
  });
