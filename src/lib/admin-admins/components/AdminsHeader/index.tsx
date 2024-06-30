import { FC } from "react"
import styles from "./styles.module.css"
import Filter from "./Filter"

const AdminsHeader: FC = () => {
  return (
    <div className={"space-y-5"}>
      <h3 className={styles.headingtext}>admin organizers</h3>
      <Filter />
    </div>
  )
}

export default AdminsHeader
