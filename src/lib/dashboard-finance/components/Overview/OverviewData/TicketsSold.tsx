import { FC } from "react"
import OverviewCard from "@lib/dashboard-overview/components/OverviewCard"
import useFinanceData from "@lib/dashboard-finance/hooks/useFinanceData"
import { numberFormatter } from "@common/utils/numberFormatter"

const TicketsSold: FC = () => {
  const { data: finance } = useFinanceData()

  if (!finance) return null

  return (
    <OverviewCard theme={"black"}>
      <div className="pb-7 space-y-2 px-6 pt-4">
        <h2 className={"text-3xl text-white font-bold"}>
          {numberFormatter(finance.tickets_sold, 0)}
        </h2>
        <h4 className="font-bold text-white">Tickets sold</h4>
      </div>
    </OverviewCard>
  )
}

export default TicketsSold
