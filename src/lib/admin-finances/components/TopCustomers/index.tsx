import OverviewCard from "@lib/admin-dashboard/components/OverviewCard"
import Select from "@lib/admin-dashboard/components/Select"
import {
  MONTHS,
  MONTHS_INDEX,
  MONTHS_MAP,
} from "@lib/admin-dashboard/constants/months"
import useTopCustomers from "@lib/admin-finances/hooks/useTopCustomers"
import CardHeader from "@lib/admin-overview/components/RevenueEventOverview/CardHeader"
import Customer from "@lib/admin-overview/components/TopCustomers/Customer"
import { useRouter } from "next/router"
import { FC } from "react"

const TopCustomers: FC = () => {
  const router = useRouter()
  const { data: customers } = useTopCustomers()
  const monthIndex = router.query?.customer_month as string

  const selectedMonth = !monthIndex
    ? MONTHS_MAP[new Date().getMonth() + 1]
    : MONTHS_MAP[parseInt(monthIndex)]
  const onSelectMonth = (month: number) => {
    router.push({
      query: {
        ...router.query,
        customer_month: month,
      },
    })
  }

  return (
    <div className="w-full lg:w-1/2">
      <OverviewCard>
        <CardHeader title="Top customers">
          <Select
            options={MONTHS_INDEX}
            optionsDisplay={MONTHS}
            onSelect={onSelectMonth}
            selectedOption={selectedMonth}
          />
        </CardHeader>
        <div className="p-4">
          {customers?.map((c) => (
            <Customer {...c} totalTicket={c.total_tickets} key={c.id} />
          ))}
        </div>
      </OverviewCard>
    </div>
  )
}

export default TopCustomers
