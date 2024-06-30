import { OrderHistoryData } from "@lib/admin-order-history/typings";
import { HttpResponse } from "@common/typings";
import { axiosInstance } from "@common/utils/axiosInstance";

export const getOrderHistory = async (
  page?: string,
): Promise<OrderHistoryData> => {
  const { AppAxios } = axiosInstance();
  const res: HttpResponse<OrderHistoryData> = await AppAxios({
    url: `/admin/order-history?page=${page ?? ""}`,
  }).then((res) => res.data);

  return res.data;
};
