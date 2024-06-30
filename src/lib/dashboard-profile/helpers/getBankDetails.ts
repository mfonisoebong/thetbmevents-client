import { HttpResponse } from "@common/typings"
import { BankDetails } from "../typings"
import { axiosInstance } from "@common/utils/axiosInstance"

export const getBankDetails = async (): Promise<BankDetails> => {
  const { AppAxios } = axiosInstance()
  const res: HttpResponse<BankDetails> = await AppAxios({
    url: "/bank-details",
  }).then((res) => res.data)

  return res.data
}
