import { axiosInstance } from "@common/utils/axiosInstance";
import { Coupon } from "@lib/coupons/typings";

export const getCoupon = async (id?: string): Promise<Coupon> => {
  const { AppAxios } = axiosInstance();
  return AppAxios({
    url: `/coupons/${id}`,
  }).then((res) => res.data.data);
};
