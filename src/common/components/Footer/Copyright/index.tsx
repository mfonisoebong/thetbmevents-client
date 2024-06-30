import { FC } from "react"
import styles from "../styles.module.css"

const Copyright: FC = () => {
  const currentYear = new Date().getFullYear()

  return (
    <div className={styles.copyright}>
      <p>&copy; {currentYear} TBM events. All rights reserved.</p>
    </div>
  )
}

export default Copyright
