import { z } from "zod";

export const signupSchema = z.object({
  username: z.string().trim(),
  email: z.string().trim().toLowerCase(),
  password: z.string(),
});

export type SignupInput = z.infer<typeof signupSchema>;

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase(),
  password: z.string(),
});
export type LoginInput = z.infer<typeof loginSchema>;
