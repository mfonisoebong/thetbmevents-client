import { nullable, z } from "zod";

const DateAndTimeSchema = z.object({
  start: z.string().nonempty("Required"),
  end: z.string().nonempty("Required"),
});

export const TicketSchema = z.object({
  id: z.any().nullable(),
  name: z.string().nonempty("Ticket name is required"),
  description: z.string().nonempty("Description is required"),
  price: z
    .number({
      invalid_type_error: "Input a valid price",
    })
    .min(0, "Price cannot be less that 0 naira"),
  unlimited: z.boolean().default(false),
  quantity: z
    .number({
      invalid_type_error: "Input a valid quantity",
    })
    .min(0, "Quantity is required"),
  sellingDate: DateAndTimeSchema,
});

export const AboutSchema = z.object({
  eventType: z.enum(["physical", "virtual"], {
    required_error: "Ticket type is required",
    invalid_type_error: "Pick a valid type",
  }),
  name: z.string().nonempty("Event name is required"),
  description: z.string().nonempty("Event description is required"),
  social: z.object({
    instagram: z.string().optional().nullable().default(null),
    facebook: z.string().optional().nullable().default(null),
    twitter: z.string().optional().nullable().default(null),
  }),
  image: z.string().nonempty("Event Image is required"),
  eventLink: z.string().nullable().default(null),
  category: z.string().nonempty("Category is required"),
  location: z.string().default("").nullable(),
  undiscloseLocation: z.boolean().default(false),
  locationTips: z.string().optional().nullable(),
});

export const DateSchema = z.object({
  timeZone: z.string().nonempty("Timezone is required"),
  eventDate: z.string().nonempty("Required"),
  eventTime: z.string().nullable().default(null),
});

export const EventSchema = z.object({
  about: AboutSchema,
  date: DateSchema,
  ticket: z.array(TicketSchema).min(1),
});

export type AboutFormType = z.infer<typeof AboutSchema>;
export type DateFormType = z.infer<typeof DateSchema>;
export type EventFormType = z.infer<typeof EventSchema>;
export type TicketFormType = z.infer<typeof TicketSchema>;
