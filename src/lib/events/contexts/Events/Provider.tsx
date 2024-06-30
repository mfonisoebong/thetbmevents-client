import { FC } from "react"
import { EventsContext } from "./Context"
import { EventsProviderProps } from "@lib/events/typings"
import RenderHydrated from "@common/components/RenderHydrated"

const EventsProvider: FC<EventsProviderProps> = ({ children, eventData }) => {
  return (
    <RenderHydrated>
      <EventsContext.Provider value={{ eventData }}>
        {children}
      </EventsContext.Provider>
    </RenderHydrated>
  )
}

export default EventsProvider
