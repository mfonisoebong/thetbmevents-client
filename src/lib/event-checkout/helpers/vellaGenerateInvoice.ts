import { axiosInstance } from "@common/utils/axiosInstance";
import { HttpResponse } from "@common/typings";
import { PaymentData } from "@lib/event-checkout/typings";

interface Data {
  id: string;
  redirect_url: string;
  authorization_url: string;
}

export const vellaGenerateInvoice = async (
  ref: string,
  data: PaymentData,
): Promise<Data> => {
  const { AppAxios } = axiosInstance();

  const res: HttpResponse<Data> = await AppAxios({
    url: `/payments/vella/${ref}`,
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

  return res.data;
};
