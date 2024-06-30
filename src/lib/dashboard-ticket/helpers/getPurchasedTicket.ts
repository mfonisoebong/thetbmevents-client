import { PurchasedTicket } from "@lib/dashboard-tickets/typings";
import { HttpResponse } from "@common/typings";
import { axiosInstance } from "@common/utils/axiosInstance";

export const getPurchasedTicket = async (
  id?: string,
): Promise<PurchasedTicket> => {
  const { AppAxios } = axiosInstance();
  const res: HttpResponse<PurchasedTicket> = await AppAxios({
    url: `/tickets/purchased/${id}`,
  }).then((res) => res.data);

  return res.data;
};
