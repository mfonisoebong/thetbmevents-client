import { useQuery } from "@tanstack/react-query"
import { getEventsByLocation } from "../helpers/getEventsByLocation"

export default function useEventsByLocation() {
  const events = useQuery(["events", "location"], getEventsByLocation)

  return events
}
