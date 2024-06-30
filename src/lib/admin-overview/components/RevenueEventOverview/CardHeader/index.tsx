import { FC, PropsWithChildren } from "react"
import { CardHeaderProps } from "@lib/admin-overview/typings"
import PieChart from "@common/components/Icons/PieChart"
import styles from "../styles.module.css"
const CardHeader: FC<PropsWithChildren<CardHeaderProps>> = ({
  title,
  children,
}) => {
  return (
    <div className="flex items-center justify-between w-full border-b-[0.1rem] border-gray-300 border-solid">
      <div className={styles.cardheader}>
        <PieChart color={"black"} />
        <p>{title}</p>
      </div>
      {children}
    </div>
  )
}

export default CardHeader
