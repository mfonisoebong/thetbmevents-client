import { axiosInstance } from "@common/utils/axiosInstance";

export const resendPurchasedTickets = async (id?: string) => {
  const { AppAxios } = axiosInstance();

  return AppAxios({
    url: `/sales/${id}/resend-purchased-tickets`,
    method: "POST",
  }).then((res) => res.data);
};
