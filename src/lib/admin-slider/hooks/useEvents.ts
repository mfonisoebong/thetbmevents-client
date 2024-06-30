import { useQuery } from "@tanstack/react-query"
import { getAllEvents } from "../helpers/getAllEvents"

export default function useEvents() {
  const events = useQuery(["admin-events"], getAllEvents)

  return events
}
