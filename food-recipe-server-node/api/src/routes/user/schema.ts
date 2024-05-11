import { password } from "bun";
import { z } from "zod";

export const updateProfileSchema = z.object({
  password: z
    .string()
    .min(6, { message: "Min length of new Password must be 6" })
    .optional(),
  full_name: z.string().trim().optional(),
});
