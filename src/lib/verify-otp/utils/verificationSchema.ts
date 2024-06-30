import { z } from "zod"

export const VerificationSchema = z.object({
  otp: z
    .string()
    .nonempty("OTP is required")
    .min(6, "OTP must not be less that 6 characters")
    .max(6, "OTP must not be more that 6 characters")
    .regex(/^\d+$/, "Invalid OTP code"),
})

export type VerificationFormType = z.infer<typeof VerificationSchema>
