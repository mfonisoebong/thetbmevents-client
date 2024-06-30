import { Tab } from "@lib/dashboard/typings"
import { FC } from "react"
import styles from "./styles.module.css"
import useDashboardTabsContext from "@lib/dashboard/hooks/useDashboardTabsContext"

const Tab: FC<Tab> = ({ tab }) => {
  const { tabState, changeTabPosition } = useDashboardTabsContext()

  const isActive = tabState.activeTab === tab

  const onClick = () => {
    changeTabPosition(tab)
  }

  return (
    <button
      onClick={onClick}
      className={isActive ? styles.activetab : styles.tab}
    >
      {tab}
    </button>
  )
}

export default Tab
