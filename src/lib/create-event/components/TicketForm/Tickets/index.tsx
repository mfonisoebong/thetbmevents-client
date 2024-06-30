import Button from "@common/components/Button"
import NoContent from "@common/components/NoContent"
import { TicketsProps } from "@lib/create-event/typings"
import {
  EventFormType,
  TicketSchema,
} from "@lib/create-event/utils/eventSchema"
import OverviewCard from "@lib/dashboard-overview/components/OverviewCard"
import { FC } from "react"
import { useFormContext } from "react-hook-form"
import TicketsDisplay from "../TicketsDisplay"

const Tickets: FC<TicketsProps> = ({ addTicket }) => {
  const { watch } = useFormContext<EventFormType>()
  const tickets = watch("ticket")

  const noTickets = !tickets || tickets?.length === 0
  if (noTickets) {
    return (
      <NoContent
        title="There is no ticket for this event."
        button={{
          text: "Add Ticket",
          action: addTicket,
          variant: "outline",
        }}
      />
    )
  }

  return (
    <div>
      <OverviewCard theme="light">
        <div className="flex justify-between items-center">
          <h3 className="text-bold text-xl uppercase font-bold">tickets</h3>
          <Button onClick={addTicket} size="lg" className="px-12">
            Add new
          </Button>
        </div>
      </OverviewCard>

      <TicketsDisplay />
    </div>
  )
}

export default Tickets
