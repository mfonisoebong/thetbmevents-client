import { FC } from "react"
import styles from "../styles.module.css"
import SortFilters from "./SortFilters"
import SearchFilter from "./SearchFilter"
const Filter: FC = () => {
  return (
    <div className={styles.filter}>
      <SearchFilter />
      <SortFilters />
    </div>
  )
}

export default Filter
