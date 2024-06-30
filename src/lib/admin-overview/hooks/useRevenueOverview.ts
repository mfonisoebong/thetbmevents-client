import { useRouter } from "next/router"
import { useQuery } from "@tanstack/react-query"
import { getRevenueOverview } from "@lib/admin-overview/helpers/getRevenueOverview"

export default function useRevenueOverview() {
  const router = useRouter()
  const month = router.query.revenue_overview_month as string
  const fetcher = () => getRevenueOverview(month)

  if (!month) {
    const date = new Date()
    router.push({
      query: {
        ...router.query,
        revenue_overview_month: date.getMonth() + 1,
      },
    })
  }

  const revenueOverview = useQuery(["admin_revenue_overview", month], fetcher)

  return revenueOverview
}
