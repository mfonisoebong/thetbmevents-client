import { axiosInstance } from "@common/utils/axiosInstance"
import { Customer } from "../typings"

export const getTopCustomers = (
  month?: string,
  year?: string | number
): Promise<Customer[]> => {
  const { AppAxios } = axiosInstance()
  return AppAxios({
    url: `/admin/finances/top-customers?year=${year ?? ""}&month=${
      month ?? ""
    }`,
  }).then((res) => res.data.data)
}
