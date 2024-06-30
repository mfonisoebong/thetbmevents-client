import { z } from "zod";

const EMPTY_FIELD_ERROR = "Field cannot be empty";
export const AttendeeSchema = z
  .object({
    firstName: z.string().nonempty(EMPTY_FIELD_ERROR),
    lastName: z.string().nonempty(EMPTY_FIELD_ERROR),
    email: z.string().email(),
    confirmEmail: z.string().nonempty(EMPTY_FIELD_ERROR),
    ticketId: z.string().nonempty(EMPTY_FIELD_ERROR),
  })
  .refine((data) => data.email === data.confirmEmail, {
    message: "Emails do not match",
    path: ["confirmEmail"],
  });

export const CustomerSchema = z
  .object({
    firstName: z.string().nonempty(EMPTY_FIELD_ERROR),
    lastName: z.string().nonempty(EMPTY_FIELD_ERROR),
    email: z.string().email(),
    confirmEmail: z.string().nonempty(EMPTY_FIELD_ERROR),
    phone: z.object({
      dialCode: z.string().nonempty(EMPTY_FIELD_ERROR),
      number: z.string().nonempty(EMPTY_FIELD_ERROR),
    }),
  })
  .refine((data) => data.email === data.confirmEmail, {
    message: "Emails do not match",
    path: ["confirmEmail"],
  });
export const ContactInformationSchema = z.object({
  customer: CustomerSchema,
  attendees: z.array(AttendeeSchema).min(0),
});

export type ContactInformationFormType = z.infer<
  typeof ContactInformationSchema
>;
export type AttendeeFormType = z.infer<typeof AttendeeSchema>;
export type CustomerFormType = z.infer<typeof CustomerSchema>;
