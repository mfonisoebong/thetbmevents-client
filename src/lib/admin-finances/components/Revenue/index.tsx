import { FC } from "react"
import OverviewCard from "@lib/dashboard-overview/components/OverviewCard"
import RevenueChart from "./RevenueChart"

const Revenue: FC = () => {
  return (
    <div className={""}>
      <OverviewCard title="Revenue" theme="light">
        <RevenueChart />
      </OverviewCard>
    </div>
  )
}

export default Revenue
