import { axiosInstance } from "@common/utils/axiosInstance"
import { Bank } from "../typings"

export const getBanks = async (): Promise<Bank[]> => {
  const { VellaAxios } = axiosInstance()

  return VellaAxios({
    url: "/banks",
  }).then((res) => res.data.data)
}
