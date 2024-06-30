import { FC } from "react"
import styles from "./styles.module.css"
import { AlertProps } from "@common/typings"
import { AnimatePresence } from "framer-motion"
import AlertBox from "./AlertBox"

const Alert: FC<AlertProps> = ({ alertMessages }) => {
  if (alertMessages.length === 0) return null

  return (
    <div className={styles.alert}>
      <AnimatePresence mode="popLayout">
        {alertMessages.map((m, index) => (
          <AlertBox {...m} key={index + m.title} index={index} />
        ))}
      </AnimatePresence>
    </div>
  )
}

export default Alert
