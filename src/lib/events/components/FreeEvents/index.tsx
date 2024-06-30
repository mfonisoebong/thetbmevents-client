import { FC } from "react"
import Section from "../Section"
import useEventsContext from "@lib/events/hooks/useEventsContext"
import Events from "../Events"

const FreeEvents: FC = () => {
  const {
    eventData: { popular },
  } = useEventsContext()
  const sectionTitle = "Free"

  if (popular.free.length === 0) {
    return null
  }

  return (
    <Section title={sectionTitle}>
      <Events events={popular.free} category="free" />
    </Section>
  )
}

export default FreeEvents
