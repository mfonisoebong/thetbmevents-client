import useOrganizer from "@lib/admin-organizer/hooks/useOrganizer"
import { useRouter } from "next/router"
import { FC, PropsWithChildren } from "react"

const RedirectWrapper: FC<PropsWithChildren> = ({ children }) => {
  const { data: organizer, isLoading } = useOrganizer()
  const router = useRouter()

  if (isLoading) return null

  if (!organizer) {
    router.push("/admin/overview")
  }

  return <>{children}</>
}

export default RedirectWrapper
