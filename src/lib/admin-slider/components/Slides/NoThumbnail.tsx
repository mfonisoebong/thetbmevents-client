import { FC } from "react"
import styles from "./styles.module.css"

const NoThumbnail: FC = () => {
  return (
    <div className={styles.nothumbnail}>
      <h4>Event Image</h4>
      <p>It fills automatically when an event is selected</p>
    </div>
  )
}

export default NoThumbnail
