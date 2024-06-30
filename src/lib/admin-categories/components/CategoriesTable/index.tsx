import { FC } from "react"
import styles from "@lib/create-event/components/TicketForm/TicketsDisplay/styles.module.css"
import NoContent from "@common/components/NoContent"
import Loader from "@common/components/RouteLoader/Loader"
import TableHead from "./TableHead"
import TableBody from "./TableBody"
import { useSearchParams } from "next/navigation"
import useCategories from "@lib/admin-categories/hooks/useCategories"

const CategoriesTable: FC = () => {
  const { isLoading, data: categories } = useCategories()
  const searchParams = useSearchParams()
  const sort = searchParams.get("sort")

  if (isLoading) {
    return <Loader />
  }
  if (!isLoading && categories?.data.length === 0) {
    return <NoContent title={"No categories found"} />
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

export default CategoriesTable
