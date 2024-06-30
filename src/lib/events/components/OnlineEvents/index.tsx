import { FC } from "react"
import Section from "../Section"
import useEventsContext from "@lib/events/hooks/useEventsContext"
import Events from "../Events"

const OnlineEvents: FC = () => {
  const {
    eventData: { popular },
  } = useEventsContext()
  const sectionTitle = "Online"

  if (popular.online.length === 0) {
    return null
  }

  return (
    <Section title={sectionTitle}>
      <Events events={popular.online} category="online" />
    </Section>
  )
}

export default OnlineEvents
