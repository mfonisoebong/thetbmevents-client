import { RevenueCardProps } from "@lib/admin-finances/typings"
import { FC } from "react"
import styles from "./styles.module.css"
import { twMerge } from "tailwind-merge"
import { numberFormatter } from "@common/utils/numberFormatter"
const RevenueCard: FC<RevenueCardProps> = (props) => {
  const c = twMerge(
    styles.card,
    props.theme === "light" ? styles.lightcard : styles.darkcard
  )
  const increase = props.rate > 0

  return (
    <div className={c}>
      <h4>{props.title}</h4>
      <h2>
        <span>₦{numberFormatter(props.value, 2)}</span>
        <span className={increase ? styles.increase : styles.decrease}>
          {props.rate}%
        </span>
      </h2>
    </div>
  )
}

export default RevenueCard
