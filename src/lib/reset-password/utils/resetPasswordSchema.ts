import { z } from "zod"

export const ResetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(6, "Password is too short")
      .max(30, "Password is too long"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export type ResePasswordForm = z.infer<typeof ResetPasswordSchema>
