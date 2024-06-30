import { FC } from "react"
import styles from "@lib/create-event/components/TicketForm/TicketsDisplay/styles.module.css"
import NoContent from "@common/components/NoContent"
import Loader from "@common/components/RouteLoader/Loader"
import TableHead from "./TableHead"
import TableBody from "./TableBody"
import { useSearchParams } from "next/navigation"
import useOrganizers from "@lib/admin-organizers/hooks/useOrganizers"

const OrganizersTable: FC = () => {
  const { isLoading, data: users } = useOrganizers()
  const searchParams = useSearchParams()
  const sort = searchParams.get("sort")

  if (isLoading) {
    return <Loader />
  }
  if (!isLoading && users?.data.length === 0) {
    return <NoContent title={"No organizers found"} />
  }

  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <TableHead />
        <TableBody key={sort} />
      </table>
    </div>
  )
}

export default OrganizersTable
