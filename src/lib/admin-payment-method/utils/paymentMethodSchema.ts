import { z } from "zod"

export const FlutterwaveSchema = z.object({
  liveKey: z.string().nonempty("Flw Live key is required"),
  testKey: z.string().nonempty("Flw Test key is required"),
})

export const PaystackSchema = z.object({
  liveKey: z.string().nonempty("Paystack Live key is required"),
  testKey: z.string().nonempty("Paystack Test key is required"),
})

export type FlutterwaveFormType = z.infer<typeof FlutterwaveSchema>
export type PaystackFormType = z.infer<typeof PaystackSchema>
