import { z } from "zod";

export const CouponFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  code: z.string().min(1, "Coupon code is required"),
  eventId: z.string().min(1, "Event ID is required"),
  startDateTime: z.string().min(1, "Start date time required"),
  endDateTime: z.string().min(1, "End date time required"),
  type: z.enum(["fixed", "percentage"], {
    required_error: "Coupon type is required",
    invalid_type_error: "Invalid field",
  }),
  status: z.enum(["active", "inactive"], {
    required_error: "Status is required",
    invalid_type_error: "Invalid field",
  }),
  value: z
    .number({
      invalid_type_error: "Invalid number",
      required_error: "Value is required",
    })
    .min(0, "Value cannot be less than 0"),
  limit: z
    .number({
      invalid_type_error: "Invalid number",
      required_error: "Limit is required",
    })
    .nullable(),
  referralName: z.string().nullable(),
});

export type CouponSchemaType = z.infer<typeof CouponFormSchema>;
