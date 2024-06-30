import { HttpResponse } from "@common/typings"
import { RevenueOverview } from "../typings"
import { axiosInstance } from "@common/utils/axiosInstance"
import { Data, DataKey } from "@lib/dashboard-finance/helpers/getFinanceData"

export const getRevenueOverview = async (
  data: Data,
  key: DataKey
): Promise<RevenueOverview> => {
  const { AppAxios } = axiosInstance()

  const url = "/admin/finances/revenue-commisions-overview"

  const parsedUrl: Record<DataKey, string> = {
    today: `${url}?today=true`,
    past_three_months: `${url}?past_three_months=true`,
    range: `${url}?from=${data.range?.from}&to=${data.range?.to}`,
    yearAndMonth: `${url}?year=${data.yearAndMonth?.year}&month=${data.yearAndMonth?.month}`,
    yesterday: `${url}?yesterday=true`,
  }

  const res: HttpResponse<RevenueOverview> = await AppAxios({
    url: parsedUrl[key],
  }).then((res) => res.data)

  return res.data
}
