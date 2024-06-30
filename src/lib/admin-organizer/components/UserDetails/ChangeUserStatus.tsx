import Button from "@common/components/Button"
import useChangeUserStatus from "@lib/admin-dashboard/hooks/useChangeUserStatus"
import useOrganizer from "@lib/admin-organizer/hooks/useOrganizer"
import { useRouter } from "next/router"
import { FC } from "react"

const ChangeUserStatus: FC = () => {
  const { data, refetch } = useOrganizer()
  const { query } = useRouter()
  const userId = query?.id as string

  const {
    activateUser,
    deactivateUser,
    mutation: { isLoading },
  } = useChangeUserStatus({
    id: userId,
    onSuccess: refetch,
  })

  return (
    <div>
      {data?.account_status === "active" ? (
        <Button
          onClick={deactivateUser}
          loading={isLoading}
          disabled={isLoading}
          size="sm"
          variant="outline"
        >
          Deactivate organizer
        </Button>
      ) : (
        <Button
          onClick={activateUser}
          loading={isLoading}
          disabled={isLoading}
          size="sm"
          variant="outline"
        >
          Activate organizer
        </Button>
      )}
    </div>
  )
}

export default ChangeUserStatus
