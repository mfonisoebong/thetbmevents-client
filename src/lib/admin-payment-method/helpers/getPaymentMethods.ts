import { axiosInstance } from "@common/utils/axiosInstance";
import { Gateway, PaymentMethod } from "../typings";

export const getPaymentMethod = async (
  gateway: Gateway,
): Promise<PaymentMethod> => {
  const { AppAxios } = axiosInstance();

  return AppAxios({
    url: `/payment-methods?gateway=${gateway}`,
  }).then((res) => res.data.data);
};
