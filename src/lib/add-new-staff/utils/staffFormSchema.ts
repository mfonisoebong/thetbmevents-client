import { z } from "zod";

export const StaffFormSchema = z.object({
  firstName: z.string().nonempty("First name is required"),
  lastName: z.string().nonempty("Last name is required"),
  adminRole: z.enum(["super_admin", "support", "manager"]),
  email: z.string().email("Invalid email provided"),
  country: z.string().nonempty("Country is required"),
  dialCode: z.string().nonempty("Dial code is required"),
  phoneNumber: z.string().regex(/^\d+$/, "Invalid phone number"),
});

export type StaffFormType = z.infer<typeof StaffFormSchema>;
