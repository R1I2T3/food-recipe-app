import { z } from "zod";

export const LoginSchema = z.object({
  username: z.string().trim().min(1, "Username is required"),
  password: z
    .string()
    .min(6, { message: "Minimum length of password should be 6" }),
});

export const SignUpSchema = z.object({
  username: z.string().min(1, { message: "Username is required field" }),
  fullName: z.string().min(1, { message: "Username is required field" }),
  password: z
    .string()
    .min(6, { message: "Minimum length of password should be 6" }),
  gender: z.enum(["Male", "Female", "Other"]),
});
