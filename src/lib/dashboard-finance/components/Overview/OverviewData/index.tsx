import { FC } from "react"
import TicketsSold from "@lib/dashboard-finance/components/Overview/OverviewData/TicketsSold"
import CommonCard from "@lib/dashboard-finance/components/Overview/OverviewData/CommonCard"
import useFinanceData from "@lib/dashboard-finance/hooks/useFinanceData"
import { numberFormatter } from "@common/utils/numberFormatter"
const OverviewData: FC = () => {
  const { data: finance } = useFinanceData()
  if (!finance) return null

  return (
    <div className={"w-full lg:w-7/12 space-y-4"}>
      <TicketsSold />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <CommonCard
          body={`₦${numberFormatter(finance.revenue_overview.revenue, 0)}`}
          theme={"light"}
          title={"Revenue"}
        />

        <CommonCard
          body={`${finance.commision_rate}%`}
          theme={"light"}
          title={"Commision Rate"}
        />

        <CommonCard
          body={`₦${numberFormatter(finance.revenue_overview.profit, 0)}`}
          theme={"light"}
          title={"Profit"}
        />
      </div>
    </div>
  )
}

export default OverviewData
