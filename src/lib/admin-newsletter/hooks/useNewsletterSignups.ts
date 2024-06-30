import { useQuery } from "@tanstack/react-query"
import { getNewsletterSignup } from "../helpers/getNewsletterSignup"
import { useSearchParams } from "next/navigation"

export default function useNewsletterSignups() {
  const searchParams = useSearchParams()
  const page = searchParams.get("page")

  const fetcher = () => getNewsletterSignup(page)
  const newsletters = useQuery(["admin-newsletters", page], fetcher)

  return newsletters
}
