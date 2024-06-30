import { useContext } from "react"
import { SidebarContext } from "../contexts/Sidebar/Context"

export default function useSidebarContext() {
  return useContext(SidebarContext)
}
