import { z } from "zod";

export const ExportAttendeesSchema = z.object({
  eventId: z.string().min(1, "Event is required"),
});

export type ExportAttendeesSchemaType = z.infer<typeof ExportAttendeesSchema>;
