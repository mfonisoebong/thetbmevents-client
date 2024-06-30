import { FC } from "react"
import OverviewCard from "@lib/dashboard-overview/components/OverviewCard"
import styles from "./styles.module.css"
import useNotifications from "@lib/dashboard/hooks/useNotifications"
import Notification from "@lib/dashboard-notifications/components/Notifications/Notification"
import NoContent from "@common/components/NoContent"
const Notifications: FC = () => {
  const { data: notifications } = useNotifications()

  if (!notifications?.length) {
    return <NoContent title="No notifications yet" />
  }

  return (
    <OverviewCard theme={"light"}>
      <div className={styles.notifications}>
        {notifications?.map((n) => (
          <Notification
            unread={n.unread}
            body={n.body}
            createdAt={n.created_at}
            key={n.id}
          />
        ))}
      </div>
    </OverviewCard>
  )
}

export default Notifications
