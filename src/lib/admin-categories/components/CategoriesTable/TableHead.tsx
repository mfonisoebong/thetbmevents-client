import { FC } from "react"
import styles from "@lib/create-event/components/TicketForm/TicketsDisplay/styles.module.css"
import useMediaQuery from "@common/hooks/useMediaQuery"
import { Device } from "@common/typings"

const TableHead: FC = () => {
  const isLargeDevice = useMediaQuery(Device.large)

  if (!isLargeDevice) return null

  return (
    <thead className={styles.tablehead}>
      <tr>
        <th>Category Name</th>
        <th>Categories slug</th>
        <th>Date Created</th>
        <th></th>
      </tr>
    </thead>
  )
}

export default TableHead
