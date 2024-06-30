import { z } from "zod"

export const NewsletterSchema = z.object({
  email: z.string().email("Invalid email provided"),
})

export type NewsletterForm = z.infer<typeof NewsletterSchema>
