import { axiosInstance } from "@common/utils/axiosInstance"
import { PaystackFormType } from "../utils/paymentMethodSchema"

export const updatePaystackMethod = async (data: PaystackFormType) => {
  const { AppAxios } = axiosInstance()

  return AppAxios({
    url: "/admin/payment-methods/paystack",
    method: "PATCH",
    data: {
      live_key: data.liveKey,
      test_key: data.testKey,
    },
  }).then((res) => res.data)
}
