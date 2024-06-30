import useFilteredEvents from "@lib/events/hooks/useFilteredEvents"
import { FC } from "react"
import EventCard from "../Events/EventCard"

const Events: FC = () => {
  const { data: filtered } = useFilteredEvents()

  return (
    <div className="my-14 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 md:gap-x-5 gap-y-8">
      {filtered?.events?.map((event) => (
        <EventCard filtered {...event} key={event.id} />
      ))}
    </div>
  )
}

export default Events
