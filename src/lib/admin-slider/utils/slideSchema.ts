import { z } from "zod"

export const SlideSchema = z.object({
  eventId: z.string().nonempty(),
})

export const SlidesSchema = z.array(SlideSchema)
