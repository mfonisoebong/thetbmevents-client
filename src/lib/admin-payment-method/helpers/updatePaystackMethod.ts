import { axiosInstance } from "@common/utils/axiosInstance"
import { PaystackFormType, VellaFormType } from "../utils/paymentMethodSchema"

export const updatePaystackMethod = async (data: PaystackFormType) => {
  const { AppAxios } = axiosInstance()

  return AppAxios({
    url: "/admin/payment-methods/paystack",
    method: "PATCH",
    data: {
      webhook_url: data.webhookUrl,
      live_key: data.liveKey,
      test_key: data.testKey,
    },
  }).then((res) => res.data)
}
