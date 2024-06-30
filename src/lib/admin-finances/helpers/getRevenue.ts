import { axiosInstance } from "@common/utils/axiosInstance"
import { RevenueOverviewData } from "@lib/admin-overview/typings"

export const getRevenue = async (): Promise<RevenueOverviewData[]> => {
  const { AppAxios } = axiosInstance()

  return AppAxios({
    url: "/admin/finances/all-through-the-year",
  }).then((res) => res.data.data)
}
