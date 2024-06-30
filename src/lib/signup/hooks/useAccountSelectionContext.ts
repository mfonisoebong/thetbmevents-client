import { useContext } from "react"
import { AccountSelectionContext } from "../contexts/AccountSelection/Context"

export default function useAccountSelectionContext() {
  return useContext(AccountSelectionContext)
}
