import OverviewCard from "@lib/admin-dashboard/components/OverviewCard"
import CardHeader from "@lib/admin-overview/components/RevenueEventOverview/CardHeader"
import { FC } from "react"
import Filter from "./Filter"
import useRevenueOverview from "@lib/admin-finances/hooks/useRevenueOverview"
import RevenueCard from "./RevenueCard"

const RevenueOverview: FC = () => {
  const { data: overview } = useRevenueOverview()

  return (
    <OverviewCard>
      <div className="space-y-4 py-4">
        <CardHeader title={"Revenue Overview"}>
          <Filter />
        </CardHeader>
        <div className="flex flex-col lg:flex-row space-y-5 lg:space-y-0 lg:space-x-5 p-5">
          {overview && (
            <>
              <RevenueCard
                rate={overview.revenue_rate}
                theme="dark"
                title="Net Revenue"
                value={overview.net_revenue}
              />
              <RevenueCard
                rate={overview.commision_rate}
                theme="light"
                title="Net Commision"
                value={overview.net_commision}
              />
            </>
          )}
        </div>
      </div>
    </OverviewCard>
  )
}

export default RevenueOverview
