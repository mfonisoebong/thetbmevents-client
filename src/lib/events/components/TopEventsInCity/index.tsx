import { FC } from "react"
import Section from "../Section"
import Events from "../Events"
import useEventsByLocation from "@lib/events/hooks/useEventsByLocation"

const TopEventsInCity: FC = () => {
  const { data: events } = useEventsByLocation()
  const sectionTitle = `Top Events In ${events?.user_info.city ?? ""}`

  if (!events || events.city.length === 0) {
    return null
  }

  return (
    <Section title={sectionTitle}>
      <Events events={events.city} />
    </Section>
  )
}

export default TopEventsInCity
