import { HttpResponse } from "@common/typings"
import { axiosInstance } from "@common/utils/axiosInstance"

export const verifyTicket = async (id: number): Promise<HttpResponse> => {
  const { AppAxios } = axiosInstance()

  return AppAxios({
    url: `/tickets/verify/${id}`,
    method: "POST",
  }).then((res) => res.data)
}
