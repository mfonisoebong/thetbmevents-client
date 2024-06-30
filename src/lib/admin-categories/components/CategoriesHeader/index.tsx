import { FC } from "react"
import styles from "./styles.module.css"
import Filter from "./Filter"

const CategoriesHeader: FC = () => {
  return (
    <div className={"space-y-5"}>
      <h3 className={styles.headingtext}>categories</h3>
      <Filter />
    </div>
  )
}

export default CategoriesHeader
