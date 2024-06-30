import { FC } from "react"
import OverviewCard from "@lib/dashboard-overview/components/OverviewCard"
import Event from "@lib/dashboard-finance/components/Overview/HighestSellingEvent/Event"
import useFinanceData from "@lib/dashboard-finance/hooks/useFinanceData"

const HighestSellingEvent: FC = () => {
  const { data: finance } = useFinanceData()
  if (!finance) return null

  return (
    <div className={"w-full lg:w-5/12 "}>
      <OverviewCard theme={"light"}>
        <div className="min-h-[20rem]">
          <h4 className={"text-gray-600 font-bold"}>Highest selling event</h4>
          <div className="mt-4 space-y-4">
            {finance.highest_selling_events.map((e) => (
              <Event
                key={e.id}
                image={e.logo}
                name={e.title}
                tickets={e.tickets}
              />
            ))}
          </div>
        </div>
      </OverviewCard>
    </div>
  )
}

export default HighestSellingEvent
