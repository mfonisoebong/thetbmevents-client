import { FC } from "react"
import OverviewCard from "../OverviewCard"
import RevenueChart from "./RevenueChart"

const Revenue: FC = () => {
  return (
    <OverviewCard title="Revenue" theme="light">
      <RevenueChart />
    </OverviewCard>
  )
}

export default Revenue
