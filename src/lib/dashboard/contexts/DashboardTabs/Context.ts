import { DashboardTabsContextValues } from "@lib/dashboard/typings"
import { createContext } from "react"

export const DashboardTabsContext = createContext(
  {} as DashboardTabsContextValues
)
