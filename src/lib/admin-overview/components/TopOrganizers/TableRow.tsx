import { FC } from "react"
import styles from "@lib/create-event/components/TicketForm/TicketsDisplay/styles.module.css"
import { OrganizerTableRowProps } from "@lib/admin-overview/typings"
import { numberFormatter } from "@common/utils/numberFormatter"

const TableRow: FC<OrganizerTableRowProps> = ({ name, ticket }) => {
  return (
    <tr className={styles.tablerow}>
      <td className="text-center w-max whitespace-nowrap">{name}</td>
      <td className="text-center w-max whitespace-nowrap">{ticket.name}</td>
      <td className="text-center w-max whitespace-nowrap">
        {numberFormatter(ticket.sold, 0)}
      </td>
    </tr>
  )
}

export default TableRow
