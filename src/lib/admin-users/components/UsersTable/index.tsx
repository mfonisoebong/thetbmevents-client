import { FC } from "react"
import styles from "@lib/create-event/components/TicketForm/TicketsDisplay/styles.module.css"
import useUsers from "@lib/admin-users/hooks/useUsers"
import NoContent from "@common/components/NoContent"
import Loader from "@common/components/RouteLoader/Loader"
import TableHead from "./TableHead"
import TableBody from "@lib/admin-users/components/UsersTable/TableBody"
import { useSearchParams } from "next/navigation"

const UsersTable: FC = () => {
  const { isLoading, data: users } = useUsers()
  const searchParams = useSearchParams()
  const sort = searchParams.get("sort")

  if (isLoading) {
    return <Loader />
  }
  if (!isLoading && users?.data.length === 0) {
    return <NoContent title={"No users found"} />
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

export default UsersTable
