import { axiosInstance } from "@common/utils/axiosInstance";
import { HttpResponse } from "@common/typings";
import { PaymentData } from "@lib/event-checkout/typings";

export const freePayment = async (data: PaymentData): Promise<HttpResponse> => {
  const { AppAxios } = axiosInstance();
  return AppAxios({
    url: "/payments/free",
    method: "POST",
    data: {
      ...data,
      attendees: data.attendees.map((a) => ({
        first_name: a.firstName,
        last_name: a.lastName,
        email: a.email,
        ticket_id: a.ticketId,
      })),
    },
  }).then((res) => res.data);
};
