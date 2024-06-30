import { z } from "zod"

export const LoginFormSchema = z.object({
  email: z.string().email({
    message: "Invalid email",
  }),
  password: z
    .string()
    .min(6, "Minimum: 6 characters")
    .max(30, "Maximum: 30 characters"),
})

export type LoginFormType = z.infer<typeof LoginFormSchema>
