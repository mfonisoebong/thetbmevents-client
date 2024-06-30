import { z } from "zod"

export const VellaSchema = z.object({
  vellaTag: z.string().nonempty("Vella tag is required"),
  webhookUrl: z.string().url("Please provide a valid url"),
  liveKey: z.string().nonempty("Live key is required"),
  testKey: z.string().nonempty("Test key is required"),
})

export const PaystackSchema = z.object({
  webhookUrl: z.string().url("Please provide a valid url"),
  liveKey: z.string().nonempty("Live key is required"),
  testKey: z.string().nonempty("Test key is required"),
})

export type VellaFormType = z.infer<typeof VellaSchema>
export type PaystackFormType = z.infer<typeof PaystackSchema>
