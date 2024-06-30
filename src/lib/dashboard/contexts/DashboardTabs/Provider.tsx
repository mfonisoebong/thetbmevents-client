import { DashboardProviderProps, TabState } from "@lib/dashboard/typings"
import { FC, useState } from "react"
import { DashboardTabsContext } from "./Context"
import DashboardTabs from "@lib/dashboard/components/DashboardTabs"

const DashboardTabsProvider: FC<DashboardProviderProps> = ({
  tabs,
  children,
}) => {
  const [tabState, setTabState] = useState<TabState>({
    activeTab: tabs[0],
    tabs,
  })

  const changeTabPosition = (pos: string | number) => {
    const newValue =
      typeof pos === "number"
        ? tabState.tabs[pos]
        : tabState.tabs.find((t) => t === pos)

    if (!newValue) return

    setTabState((state) => ({ ...state, activeTab: newValue }))
  }

  return (
    <DashboardTabsContext.Provider
      value={{
        tabState,
        changeTabPosition,
      }}
    >
      <DashboardTabs tabs={tabs} activeTab={tabState.activeTab} />
      {children}
    </DashboardTabsContext.Provider>
  )
}

export default DashboardTabsProvider
