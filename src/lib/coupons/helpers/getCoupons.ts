import { axiosInstance } from "@common/utils/axiosInstance";
import { CouponsData } from "@lib/coupons/typings";

export const getCoupons = async (page?: string): Promise<CouponsData> => {
  const { AppAxios } = axiosInstance();
  return AppAxios({
    url: "/coupons",
    params: { page },
  }).then((res) => res.data.data);
};
