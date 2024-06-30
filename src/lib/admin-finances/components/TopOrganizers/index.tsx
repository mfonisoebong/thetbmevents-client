import OverviewCard from "@lib/admin-dashboard/components/OverviewCard"
import Select from "@lib/admin-dashboard/components/Select"
import {
  MONTHS,
  MONTHS_INDEX,
  MONTHS_MAP,
} from "@lib/admin-dashboard/constants/months"
import useTopOrganizers from "@lib/admin-finances/hooks/useTopOrganizers"
import CardHeader from "@lib/admin-overview/components/RevenueEventOverview/CardHeader"
import { useRouter } from "next/router"
import { FC } from "react"
import Organizer from "./Organizer"

const TopOrganizers: FC = () => {
  const router = useRouter()
  const { data: organizers } = useTopOrganizers()
  const monthIndex = router.query?.customer_month as string

  const selectedMonth = !monthIndex
    ? MONTHS_MAP[new Date().getMonth() + 1]
    : MONTHS_MAP[parseInt(monthIndex)]
  const onSelectMonth = (month: number) => {
    router.push({
      query: {
        ...router.query,
        organizer_month: month,
      },
    })
  }

  return (
    <div className="w-full lg:w-1/2">
      <OverviewCard>
        <CardHeader title="Top organizers">
          <Select
            options={MONTHS_INDEX}
            optionsDisplay={MONTHS}
            onSelect={onSelectMonth}
            selectedOption={selectedMonth}
          />
        </CardHeader>
        <div className="space-y-3 p-4">
          {organizers?.map((o) => (
            <Organizer {...o} key={o.id} />
          ))}
        </div>
      </OverviewCard>
    </div>
  )
}

export default TopOrganizers
