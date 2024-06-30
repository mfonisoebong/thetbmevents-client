import { useContext } from "react"
import { DashboardTabsContext } from "../contexts/DashboardTabs/Context"

export default function useDashboardTabsContext() {
  return useContext(DashboardTabsContext)
}
