import { z } from "zod"

export const individualSignupFormSchema = z
  .object({
    firstName: z.string().nonempty("First name is required"),
    lastName: z.string().nonempty("Last name is required"),
    country: z.string().nonempty("Country is required"),
    dialCode: z.string().nonempty("Dial code is required"),
    phoneNumber: z.string().regex(/^\d+$/, "Invalid phone number"),
    email: z.string().email("Invalid email"),
    password: z
      .string()
      .min(6, "Minimum characters: 6")
      .max(20, "Maximum characters: 20"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export const organizationSignupFormSchema = z
  .object({
    country: z.string().nonempty("Country is required"),
    buisnessName: z.string().min(1, "Buisness name is required"),
    email: z.string().email("Invalid email"),
    dialCode: z.string().min(1, "Dial code is required"),
    phoneNumber: z.string().regex(/^\d+$/, "Invalid phone number"),
    password: z
      .string()
      .min(6, "Minimum characters: 6")
      .max(20, "Maximum characters: 20"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export type IndividualSignUpFormType = z.infer<
  typeof individualSignupFormSchema
>

export type OrganizationSignUpFormType = z.infer<
  typeof organizationSignupFormSchema
>
