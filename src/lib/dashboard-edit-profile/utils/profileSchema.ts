import { z } from "zod";

export const individualProfileSchema = z.object({
  firstName: z.string().nonempty("First name is required"),
  lastName: z.string().nonempty("Last name is required"),
  country: z.string().nonempty("Country is required"),
  dialCode: z.string().nonempty("Dial code is required"),
  phoneNumber: z.string().regex(/^\d+$/, "Invalid phone number"),
  email: z.string().email("Invalid email"),
});

export const organizationProfileSchema = z.object({
  country: z.string().nonempty("Country is required"),
  buisnessName: z.string().min(1, "Buisness name is required"),
  email: z.string().email("Invalid email"),
  dialCode: z.string().min(1, "Dial code is required"),
  phoneNumber: z.string().regex(/^\d+$/, "Invalid phone number"),
});

export type IndividualProfileFormType = z.infer<typeof individualProfileSchema>;
export type OrganizationProfileFormType = z.infer<
  typeof organizationProfileSchema
>;
