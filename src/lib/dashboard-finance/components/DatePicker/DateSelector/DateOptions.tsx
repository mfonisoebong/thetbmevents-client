import { ChangeEvent, FC, useState } from "react"
import styles from "../styles.module.css"
import FormField from "@common/components/FormControls/FormField"
import Button from "@common/components/Button"
import { WithClickAwayActionProps } from "@common/typings"
import ClickAwayListener from "react-click-away-listener"
import { useRouter } from "next/router"
import { DateOptionsProps, FromToDate } from "@lib/dashboard-finance/typings"
import moment from "moment"
import { useSearchParams } from "next/navigation"
import useDatePickerContext from "@lib/dashboard-finance/hooks/useDatePickerContext"
import { twMerge } from "tailwind-merge"
const defaultAction = () => {}

const DateOptions: FC<DateOptionsProps> = ({
  onClickAwayAction = defaultAction,
  to,
  from,
  className,
}) => {
  const { prevDate } = useDatePickerContext()
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentDate = moment().format("YYYY-MM-DD")
  const c = twMerge(styles.dateoptions, className)
  const [fromToDate, setFromToDate] = useState<FromToDate>({
    from: from ?? "",
    to: to ?? "",
  })
  const today = () => {
    router.push({
      query: {
        today: "true",
      },
    })
  }
  const yesterday = () => {
    router.push({
      query: {
        yesterday: "true",
      },
    })
  }

  const thisMonth = () => {
    const date = new Date()
    const month = date.getMonth() + 1
    const year = date.getFullYear()
    router.push({
      query: {
        month,
        year,
      },
    })
  }

  const pastThreeMonths = () => {
    router.push({
      query: {
        past_three_months: "true",
      },
    })
  }

  const handleFromToDate = (e: ChangeEvent<HTMLInputElement>) => {
    type DateKey = keyof FromToDate
    const key = e.target.name as DateKey
    const keys: DateKey[] = ["to", "from"]
    const otherKey = keys.find((k) => k !== key)

    if (!otherKey) return

    setFromToDate((state) => ({
      ...state,
      [key]: e.target.value,
    }))

    if (e.target.value && fromToDate[otherKey]) {
      router.push({
        query: {
          [key]: e.target.value,
          [otherKey]: fromToDate[otherKey],
        },
      })
    }
  }

  const selectedVariant = (key: string) => {
    const selected = searchParams.get(key)

    return selected ? "primary" : "outline"
  }

  return (
    <ClickAwayListener onClickAway={onClickAwayAction ?? defaultAction}>
      <div className={c}>
        <div className={styles.daterange}>
          <FormField
            name={"from"}
            label={"From"}
            className={"w-[45%]"}
            type={"date"}
            max={currentDate}
            onChange={handleFromToDate}
            value={fromToDate["from"]}
          />
          <FormField
            name={"to"}
            label={"To"}
            className={"w-[45%]"}
            type={"date"}
            min={fromToDate["from"]}
            max={currentDate}
            disabled={!fromToDate.from}
            onChange={handleFromToDate}
            value={fromToDate["to"]}
          />
        </div>
        <Button variant={selectedVariant("today")} onClick={today}>
          Today
        </Button>
        <Button variant={selectedVariant("yesterday")} onClick={yesterday}>
          Yesterday
        </Button>
        <Button variant={selectedVariant("month")} onClick={thisMonth}>
          This month
        </Button>
        <Button variant={"outline"} onClick={prevDate}>
          Past month
        </Button>
        <Button
          variant={selectedVariant("past_three_months")}
          onClick={pastThreeMonths}
        >
          Past 3 months
        </Button>
      </div>
    </ClickAwayListener>
  )
}

export default DateOptions
