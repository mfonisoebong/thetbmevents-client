import OverviewCard from "@lib/dashboard-overview/components/OverviewCard"
import { FC } from "react"
import styles from "./styles.module.css"
import useNotifications from "@lib/dashboard/hooks/useNotifications"
import { useMutation } from "@tanstack/react-query"
import { deleteNotifications } from "@lib/dashboard-notifications/helpers/deleteNotifications"
import useAlertContext from "@common/hooks/useAlertContext"
import Loader from "@common/components/Icons/Loader"

const Heading: FC = () => {
  const { data: notifications, refetch } = useNotifications()
  const { handleOpenAlert } = useAlertContext()
  const { mutate, isLoading } = useMutation({
    mutationFn: deleteNotifications,
    onSuccess() {
      handleOpenAlert({
        body: "Notifications deleted",
        title: "Success",
        type: "success",
      })
      refetch()
    },
    onError() {
      handleOpenAlert({
        body: "An error occurred",
        title: "Error",
        type: "error",
      })
    },
  })

  const deleteAllNotifications = () => {
    mutate()
  }

  const unreadNotifications = notifications?.filter((n) => n.unread).length

  return (
    <OverviewCard theme="light">
      <div className={styles.heading}>
        <h6>
          <span>NOTIFICATIONS</span>
          <span className={styles.badge}>{unreadNotifications}</span>
        </h6>
        {isLoading ? (
          <Loader color="black" />
        ) : (
          <button onClick={deleteAllNotifications}>Mark all as read</button>
        )}
      </div>
    </OverviewCard>
  )
}

export default Heading
