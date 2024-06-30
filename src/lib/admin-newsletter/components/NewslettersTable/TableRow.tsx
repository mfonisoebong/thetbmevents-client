import { TableRowProps } from "@lib/admin-newsletter/typings"
import { FC } from "react"
import styles from "@lib/create-event/components/TicketForm/TicketsDisplay/styles.module.css"
import moment from "moment"

const TableRow: FC<TableRowProps> = ({ created_at, email }) => {
  const dateJoined = moment(created_at).format("DD-MM-YYYY")
  return (
    <tr className={styles.tablerow}>
      <td>{email}</td>
      <td>{dateJoined}</td>
    </tr>
  )
}

export default TableRow
