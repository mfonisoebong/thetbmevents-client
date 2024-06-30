import { FC } from "react"
import Section from "../Section"
import Events from "../Events"
import useEventsByLocation from "@lib/events/hooks/useEventsByLocation"

const TopEventsInCountry: FC = () => {
  const { data: events } = useEventsByLocation()
  const sectionTitle = `Top Events In ${events?.user_info.country}`

  if (!events || events.country.length === 0) {
    return null
  }
  return (
    <Section title={sectionTitle}>
      <Events events={events.country} />
    </Section>
  )
}

export default TopEventsInCountry
