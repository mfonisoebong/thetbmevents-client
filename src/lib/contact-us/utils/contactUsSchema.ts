import { z } from "zod";

export const ContactUsSchema = z.object({
  name: z.string().nonempty("Name is required").max(200, "Field is too long"),
  email: z.string().email("Invalid email"),
  subject: z
    .string()
    .nonempty("Subject is required")
    .max(200, "Field is too long"),
  message: z.string().nonempty("Message is required"),
});

export type ContactUsFormType = z.infer<typeof ContactUsSchema>;
