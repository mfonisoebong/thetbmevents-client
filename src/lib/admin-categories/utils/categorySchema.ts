import { z } from "zod";

export const CategorySchema = z.object({
  category: z.string().nonempty("Category is required"),
  slug: z.string().nonempty("Slug is required"),
  icon: z.any(),
});

export type CategoryFormType = z.infer<typeof CategorySchema>;
