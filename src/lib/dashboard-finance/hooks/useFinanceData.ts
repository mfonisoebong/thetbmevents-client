import {
  Data as QueryData,
  DataKey as QueryDataKey,
  getFinanceData,
} from "@lib/dashboard-finance/helpers/getFinanceData"
import { useRouter } from "next/router"
import { useSearchParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import useAuth from "@common/hooks/useAuth"

type SpecialKeys = "month" | "year" | "from" | "to"

export default function useFinanceData() {
  const { user } = useAuth()
  const { query } = useRouter()
  const searchParams = useSearchParams()
  const yearAndMonth = searchParams.has("year")
  const range = searchParams.has("from") && searchParams.has("to")

  const month = searchParams.get("month")

  const queryData: QueryData = {
    today: searchParams.has("today"),
    past_three_months: searchParams.has("past_three_months"),
    yesterday: searchParams.has("yesterday"),
    yearAndMonth: yearAndMonth
      ? {
          year: searchParams.get("year") ?? "",
          month: searchParams.get("month") ?? "",
        }
      : undefined,
    range: range
      ? {
          from: searchParams.get("from") ?? "",
          to: searchParams.get("to") ?? "",
        }
      : undefined,
  }

  const queryKeys = Object.keys(query) as QueryDataKey[]
  const specialKeys: SpecialKeys[] = ["month", "year", "from", "to"]
  const specialKeyObj: Record<SpecialKeys, QueryDataKey> = {
    from: "range",
    month: "yearAndMonth",
    to: "range",
    year: "yearAndMonth",
  }
  const selectedQueryKey = specialKeys.includes(queryKeys[0] as SpecialKeys)
    ? specialKeyObj[queryKeys[0] as SpecialKeys]
    : queryKeys[0]
  const fetcher = () => getFinanceData(queryData, selectedQueryKey)
  const financeData = useQuery(
    ["finance", user.data?.id, selectedQueryKey, month],
    fetcher,
    {
      enabled: typeof selectedQueryKey === "string",
    }
  )

  return financeData
}
