import { PurchasedTicket } from "@lib/dashboard-tickets/typings";
import { HttpResponse } from "@common/typings";
import { axiosInstance } from "@common/utils/axiosInstance";

export const getPurchasedTickets = async (): Promise<PurchasedTicket[]> => {
  const { AppAxios } = axiosInstance();
  const res: HttpResponse<PurchasedTicket[]> = await AppAxios({
    url: "/tickets/purchased",
  }).then((res) => res.data);
  return res.data;
};
