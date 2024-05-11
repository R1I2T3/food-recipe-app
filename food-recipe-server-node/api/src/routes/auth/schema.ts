import { z } from "zod";

export const signupSchema = z.object({
  username: z.string().trim(),
  password: z
    .string()
    .trim()
    .min(6, { message: "Minimum length of password should be 6" }),
  full_name: z.string().trim(),
  gender: z.enum(["Male", "Female", "Other"]),
});

export const LoginSchema = z.object({
  username: z.string().trim(),
  password: z.string(),
});
