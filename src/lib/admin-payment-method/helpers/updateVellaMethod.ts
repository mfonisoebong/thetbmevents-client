import { axiosInstance } from "@common/utils/axiosInstance"
import { VellaFormType } from "../utils/paymentMethodSchema"

export const updateVellaMethod = async (data: VellaFormType) => {
  const { AppAxios } = axiosInstance()

  return AppAxios({
    url: "/admin/payment-methods/vella",
    method: "PATCH",
    data: {
      vella_tag: data.vellaTag,
      webhook_url: data.webhookUrl,
      live_key: data.liveKey,
      test_key: data.testKey,
    },
  }).then((res) => res.data)
}
