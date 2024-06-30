import { useContext } from "react"
import { EventsContext } from "../contexts/Events/Context"

export default function useEventsContext() {
  return useContext(EventsContext)
}
