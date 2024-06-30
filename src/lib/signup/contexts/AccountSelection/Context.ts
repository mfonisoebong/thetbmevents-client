import { IAccountSelectionContext } from "@lib/signup/typings"
import { createContext } from "react"

export const AccountSelectionContext = createContext(
  {} as IAccountSelectionContext
)
