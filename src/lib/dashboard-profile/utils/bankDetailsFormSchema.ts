import { z } from "zod"

const numberRegex = /^[0-9]+$/

export const BankDetailsSchema = z.object({
  bankName: z.string().nonempty("Bank name is required"),
  accountNumber: z
    .string()
    .nonempty("Account number is required")
    .min(8, "Account number must be upto 8 characters long")
    .max(12, "Account number must not be more than 12 characters long")
    .regex(numberRegex, {
      message: "Invalid account number",
    }),
  accountName: z.string().nonempty("Account name is required"),
  swiftCode: z.string().nullable().default(null),
  iban: z.string().nullable().default(null),
})

export type BankDetailsFormType = z.infer<typeof BankDetailsSchema>
