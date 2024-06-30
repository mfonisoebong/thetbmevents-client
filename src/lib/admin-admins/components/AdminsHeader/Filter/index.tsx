import { FC } from "react"
import styles from "../styles.module.css"
import SearchFilter from "@lib/admin-users/components/UsersHeader/Filter/SearchFilter"
import SortFilters from "./SortFilters"
const Filter: FC = () => {
  return (
    <div className={styles.filter}>
      <SearchFilter />
      <SortFilters />
    </div>
  )
}

export default Filter
