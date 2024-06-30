import { useRouter } from "next/router"
import { getOrganizer } from "../helpers/getOrganizer"
import { useQuery } from "@tanstack/react-query"

export default function useOrganizer() {
  const { query } = useRouter()
  const id = query?.id as string

  const fetcher = () => getOrganizer(id)

  const organizer = useQuery(["organizer", id], fetcher)

  return organizer
}
