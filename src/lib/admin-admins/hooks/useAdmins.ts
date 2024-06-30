import { useRouter } from "next/router"
import { useQuery } from "@tanstack/react-query"
import { getAdmins } from "../helpers/getAdmins"

export default function useAdmins() {
  const { query } = useRouter()
  const page = query?.page as string
  const search = query?.search as string
  const fetcher = () => getAdmins(page, search)

  const users = useQuery(["admin-admins", page, search], fetcher)

  return users
}
