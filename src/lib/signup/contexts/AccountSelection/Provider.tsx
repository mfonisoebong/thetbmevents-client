import { FC, PropsWithChildren, useState } from "react"
import { AccountSelectionContext } from "./Context"
import { AccountType } from "@lib/signup/typings"

const AccountSelectionProvider: FC<PropsWithChildren> = ({ children }) => {
  const [account, setAccount] = useState<AccountType>("individual")

  const changeAccount = (account: AccountType) => {
    setAccount(() => account)
  }

  return (
    <AccountSelectionContext.Provider
      value={{
        account,
        changeAccount,
      }}
    >
      {children}
    </AccountSelectionContext.Provider>
  )
}

export default AccountSelectionProvider
