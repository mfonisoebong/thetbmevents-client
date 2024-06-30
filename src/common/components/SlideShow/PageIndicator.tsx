import { FC } from "react"
import styles from "./styles.module.css"
import { PageIndicatorProps } from "../../../lib/home/typings"
import Cirlce from "@common/components/Icons/Circle"
import useMediaQuery from "@common/hooks/useMediaQuery"
import { Device } from "@common/typings"

const PageIndicator: FC<PageIndicatorProps> = ({ active, items, toPage }) => {
  const pageItems = Array(items).fill(undefined)
  const iconSize = useMediaQuery(Device.medium) ? 13 : 9

  return (
    <div className={styles.indicator}>
      {pageItems.map((p, i) => (
        <Cirlce
          size={iconSize}
          onClick={() => toPage(i)}
          className={i === active ? "fill-mainDark" : "fill-gray-200"}
          key={i}
        />
      ))}
    </div>
  )
}

export default PageIndicator
