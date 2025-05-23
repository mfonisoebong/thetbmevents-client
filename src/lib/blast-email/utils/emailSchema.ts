import { z } from "zod";

export const EventSchema = z.object({
  id: z.string().min(1, "Event id is required"),
  title: z.string().min(1, "Event name is required"),
});

export const BlastEmailSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  emailContent: z.string().min(1, "Email content is required"),
  events: z.array(EventSchema).min(1, "Events are required"),
});

export type BlastEmailFormType = z.infer<typeof BlastEmailSchema>;
export type EventType = z.infer<typeof EventSchema>;
