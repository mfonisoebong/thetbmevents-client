import { FC } from "react"
import styles from "@lib/create-event/components/TicketForm/TicketsDisplay/styles.module.css"
import TableHead from "@lib/dashboard-tickets/components/TicketsTable/TableHead"
import usePurchasedTickets from "@lib/dashboard-tickets/hooks/usePurchasedTickets"
import Loader from "@common/components/RouteLoader/Loader"
import TableRow from "@lib/dashboard-tickets/components/TicketsTable/TableRow"
import NoContent from "@common/components/NoContent"
const TicketsTable: FC = () => {
  const { data: tickets, isLoading } = usePurchasedTickets()

  if (isLoading) return <Loader />

  const noTickets = tickets?.length === 0

  if (noTickets) {
    return <NoContent title="You have no purchased tickets" />
  }

  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <TableHead />
        <tbody>
          {tickets?.map((t) => (
            <TableRow
              id={t.id}
              event={t.event}
              date_purchased={t.date_purchased}
              ticket={t.ticket}
              key={t.id}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default TicketsTable
