import { FC } from "react"
import OverviewCard from "@lib/dashboard-overview/components/OverviewCard"
import styles from "./styles.module.css"
import MonthPicker from "@lib/dashboard-finance/components/DatePicker/MonthPicker"
import DateSelector from "@lib/dashboard-finance/components/DatePicker/DateSelector"
const DatePicker: FC = () => {
  return (
    <OverviewCard theme={"light"}>
      <div className={styles.datepicker}>
        <div className={"lg:w-4/12"}>
          <h3>Finance</h3>
        </div>
        <div className={"lg:w-8/12 space-x-8 flex"}>
          <DateSelector />
          <MonthPicker />
        </div>
      </div>
    </OverviewCard>
  )
}

export default DatePicker
