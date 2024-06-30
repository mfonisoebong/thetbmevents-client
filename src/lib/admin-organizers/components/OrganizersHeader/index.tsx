import { FC } from "react"
import styles from "./styles.module.css"
import Filter from "@lib/admin-users/components/UsersHeader/Filter"

const OrganizersHeader: FC = () => {
  return (
    <div className={"space-y-5"}>
      <h3 className={styles.headingtext}>event organizers</h3>
      <Filter />
    </div>
  )
}

export default OrganizersHeader
