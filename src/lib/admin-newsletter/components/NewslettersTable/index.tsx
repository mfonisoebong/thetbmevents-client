import styles from "@lib/create-event/components/TicketForm/TicketsDisplay/styles.module.css"
import { FC } from "react"
import TableHead from "./TableHead"
import useNewsletterSignups from "@lib/admin-newsletter/hooks/useNewsletterSignups"
import TableRow from "./TableRow"

const NewslettersTable: FC = () => {
  const { data: newsletters } = useNewsletterSignups()

  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <TableHead />
        <tbody>
          {newsletters?.data.map((n) => (
            <TableRow {...n} key={n.email} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default NewslettersTable
