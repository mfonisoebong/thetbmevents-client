import { DashboardTabsProps } from "@lib/dashboard/typings"
import { FC } from "react"
import Tab from "./Tab"

const DashboardTabs: FC<DashboardTabsProps> = ({ activeTab, tabs }) => {
  return (
    <div className="flex">
      {tabs.map((t, i) => (
        <Tab tab={t} key={t + i} />
      ))}
    </div>
  )
}

export default DashboardTabs
