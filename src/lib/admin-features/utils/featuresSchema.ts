import { z } from "zod";

export const FeatureSchema = z.object({
  title: z.string().nonempty(),
  thumbnail: z.string().nonempty(),
  id: z.number().optional().nullable(),
});

export const FeaturesSchema = z.object({
  heading: z.string().nonempty("Heading is required"),
  subHeading: z.string().nonempty("Sub Heading is required"),
  features: z.array(FeatureSchema).min(6).max(6),
});

export type FeaturesFormType = z.infer<typeof FeaturesSchema>;
