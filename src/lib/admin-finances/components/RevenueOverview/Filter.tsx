import useToggle from "@common/hooks/useToggle"
import DateOptions from "@lib/dashboard-finance/components/DatePicker/DateSelector/DateOptions"
import { useSearchParams } from "next/navigation"
import { useRouter } from "next/router"
import { FC } from "react"
import styles from "@lib/admin-dashboard/components/Select/styles.module.css"
import Calender from "@common/components/Icons/Calender"
import ArrowDown from "@common/components/Icons/ArrowDown"
import moment from "moment"

const Filter: FC = () => {
  const router = useRouter()
  const month = router.query.month as string
  const { toggle: showOptions, handleToggle: toggleShowOptions } = useToggle()

  const searchParams = useSearchParams()
  const from = searchParams.get("from") ?? undefined
  const to = searchParams.get("to") ?? undefined

  const formattedDate = (date?: string) => {
    return moment(date).format("D MMM, YY")
  }

  if (!month) {
    const date = new Date()
    router.push({
      query: {
        ...router.query,
        month: date.getMonth() + 1,
        year: date.getFullYear(),
      },
    })
  }

  return (
    <div className="flex items-center space-x-2 pr-4 relative">
      <p className="font-medium text-xs md:text-sm lg:text-base">Filter by</p>
      {showOptions && (
        <DateOptions
          className="-left-52 lg:-left-44"
          from={from}
          to={to}
          onClickAwayAction={toggleShowOptions}
        />
      )}
      <button onClick={toggleShowOptions} className={styles.selectbutton}>
        <Calender size={14} />
        <p>
          {from ? (
            <>
              {formattedDate(from)} - {formattedDate(to)}
            </>
          ) : (
            "Any Date"
          )}
        </p>
        <ArrowDown size={14} />
      </button>
    </div>
  )
}

export default Filter
