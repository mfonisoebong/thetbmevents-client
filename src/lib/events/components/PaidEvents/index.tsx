import { FC } from "react"
import Section from "../Section"
import useEventsContext from "@lib/events/hooks/useEventsContext"
import Events from "../Events"

const PaidEvents: FC = () => {
  const {
    eventData: { popular },
  } = useEventsContext()
  const sectionTitle = "Paid"

  if (popular.paid.length === 0) {
    return null
  }

  return (
    <Section title={sectionTitle}>
      <Events events={popular.paid} category="paid" />
    </Section>
  )
}

export default PaidEvents
