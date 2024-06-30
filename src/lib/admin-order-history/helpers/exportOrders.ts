import { axiosInstance } from "@common/utils/axiosInstance";

export const exportOrders = async (ids: string[]): Promise<string> => {
  const { AppAxios } = axiosInstance();

  const idString = ids.toString();
  console.log(idString);
  return AppAxios({
    url: `/admin/order-history/export?ids=${idString}`,
  }).then((res) => res.data);
};
