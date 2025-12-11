import { axiosInstance } from "@common/utils/axiosInstance"
import { FlutterwaveFormType } from "../utils/paymentMethodSchema"

export const updateFlwMethod = async (data: FlutterwaveFormType) => {
  const { AppAxios } = axiosInstance()

  return AppAxios({
    url: "/admin/payment-methods/flutterwave",
    method: "PATCH",
    data: {
      live_key: data.liveKey,
      test_key: data.testKey,
    },
  }).then((res) => res.data)
}
