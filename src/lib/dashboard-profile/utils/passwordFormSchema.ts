import { z } from "zod"

export const passwordSchema = z
  .object({
    password: z
      .string()
      .min(6, "Password must not be less than 6 characters")
      .max(20, "Password must not be more than characters long"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export type PasswordForm = z.infer<typeof passwordSchema>
