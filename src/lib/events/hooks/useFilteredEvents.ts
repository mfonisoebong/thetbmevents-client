import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/router"
import { getFilteredEvents } from "../helpers/getFilteredEvents"

export default function useFilteredEvents() {
  const { query } = useRouter()
  const fetcher = () => getFilteredEvents(query)
  const events = useQuery(["filtered-events", query], fetcher)

  return events
}
