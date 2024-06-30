import { FC } from "react"
import styles from "../styles.module.css"
import Calender from "@common/components/Icons/Calender"
import ArrowDown from "@common/components/Icons/ArrowDown"
import DateOptions from "@lib/dashboard-finance/components/DatePicker/DateSelector/DateOptions"
import useToggle from "@common/hooks/useToggle"
import { useSearchParams } from "next/navigation"
const DateSelector: FC = () => {
  const { toggle: showOptions, handleToggle: toggleShowOptions } = useToggle()

  const searchParams = useSearchParams()
  const from = searchParams.get("from") ?? undefined
  const to = searchParams.get("to") ?? undefined

  return (
    <div className={styles.dateselector}>
      <button onClick={toggleShowOptions} className={styles.dateselectorbtn}>
        <Calender size={14} />
        <span>Any Date</span>
        <ArrowDown size={14} />
      </button>
      {showOptions && (
        <DateOptions
          from={from}
          to={to}
          onClickAwayAction={toggleShowOptions}
        />
      )}
    </div>
  )
}

export default DateSelector
