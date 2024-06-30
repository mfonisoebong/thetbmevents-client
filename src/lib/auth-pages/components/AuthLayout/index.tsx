import useAlertContext from "@common/hooks/useAlertContext"
import Sidebar from "@lib/login/components/Sidebar"
import { useRouter } from "next/router"
import { FC, PropsWithChildren, useCallback, useEffect } from "react"

const AuthLayout: FC<PropsWithChildren> = ({ children }) => {
  const { query } = useRouter()

  const authError = query?.error as string | undefined
  const { handleOpenAlert } = useAlertContext()

  const displayError = useCallback(() => {
    if (!authError) return

    handleOpenAlert({ body: authError, title: "Error", type: "error" })
  }, [handleOpenAlert, authError])

  useEffect(() => {
    displayError()
  }, [displayError])

  return (
    <div className="flex h-[100vh] min-h-[100vh]">
      <div className="w-full md:w-8/12 h-full">{children}</div>
      <Sidebar />
    </div>
  )
}

export default AuthLayout
