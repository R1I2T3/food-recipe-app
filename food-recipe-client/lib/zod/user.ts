import { z } from "zod";

export const updateUserInfoSchema = z.object({
  full_name: z.string().optional(),
  password: z.string().optional(),
});
