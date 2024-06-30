import { useRouter } from "next/router"
import { useQuery } from "@tanstack/react-query"
import { getOrganizers } from "../helpers/getOrganizers"

export default function useOrganizers() {
  const { query } = useRouter()
  const page = query?.page as string
  const search = query?.search as string
  const fetcher = () => getOrganizers(page, search)

  const users = useQuery(["admin-organizers", page, search], fetcher)

  return users
}
