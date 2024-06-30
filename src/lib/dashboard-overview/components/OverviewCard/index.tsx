import { OverviewCardProps } from "@lib/dashboard-overview/typings"
import { FC } from "react"
import styles from "./styles.module.css"
import { twMerge } from "tailwind-merge"

const OverviewCard: FC<OverviewCardProps> = (props) => {
  const themeClass =
    props.theme === "light" ? styles.lightcard : styles.darkcard

  const c = twMerge(styles.card, themeClass, props.className)

  return (
    <div style={props.styles} className={c}>
      {props.title && <h5>{props.title}</h5>}
      <div className="h-[80%]">{props.children}</div>
    </div>
  )
}

export default OverviewCard
