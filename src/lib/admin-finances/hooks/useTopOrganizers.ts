import { useQuery } from "@tanstack/react-query"
import { useSearchParams } from "next/navigation"
import { getTopOrganizers } from "../helpers/getTopOrganizers"

export default function useTopOrganizers() {
  const searchParams = useSearchParams()
  const year = new Date().getFullYear()
  const currentMonth = new Date().getMonth() + 1
  const month = searchParams.get("organizer_month") ?? currentMonth.toString()
  const fetcher = () => getTopOrganizers(month, year)
  const customers = useQuery(["admin-top-organizers", month, year], fetcher)

  return customers
}
