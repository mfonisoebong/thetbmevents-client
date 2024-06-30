import { FinanceData } from "../typings"
import { axiosInstance } from "@common/utils/axiosInstance"
import { HttpResponse } from "@common/typings"

export interface Data {
  today?: boolean
  yesterday?: boolean
  yearAndMonth?: {
    year: string
    month: string
  }
  past_three_months?: boolean
  range?: {
    from?: string
    to?: string
  }
}
export type DataKey = keyof Data

export const getFinanceData = async (
  data: Data,
  key: DataKey
): Promise<FinanceData> => {
  const { AppAxios } = axiosInstance()
  const url = "/profile/finance/overview"

  const parsedUrl: Record<DataKey, string> = {
    today: `${url}?today=true`,
    past_three_months: `${url}?past_three_months=true`,
    range: `${url}?from=${data.range?.from}&to=${data.range?.to}`,
    yearAndMonth: `${url}?year=${data.yearAndMonth?.year}&month=${data.yearAndMonth?.month}`,
    yesterday: `${url}?yesterday=true`,
  }

  const res: HttpResponse<FinanceData> = await AppAxios({
    url: parsedUrl[key],
  }).then((res) => res.data)
  return res.data
}
