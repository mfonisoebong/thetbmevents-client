import { axiosInstance } from "@common/utils/axiosInstance";

export const deleteCoupon = async (id?: string) => {
  const { AppAxios } = axiosInstance();
  return AppAxios({
    url: `/coupons/${id}`,
    method: "DELETE",
  }).then((res) => res.data.data);
};
