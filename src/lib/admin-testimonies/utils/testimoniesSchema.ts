import { z } from "zod";

const TestimonySchema = z.object({
  name: z.string().nonempty("Name is required"),
  description: z.string().nonempty("Description is required"),
  channel: z.enum(["facebook", "twitter", "instagram"], {
    invalid_type_error: "Invalid type",
  }),
  avatar: z.string().nonempty(),
  id: z.number().optional().nullable(),
});

export const TestimoniesSchema = z.object({
  heading: z.string().nonempty(),
  subHeading: z.string().nonempty(),
  testimonies: z.array(TestimonySchema).min(9).max(9),
});

export type TestimoniesFormType = z.infer<typeof TestimoniesSchema>;
