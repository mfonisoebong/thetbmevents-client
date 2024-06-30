import { useRouter } from "next/router"
import { getUsers } from "@lib/admin-users/helpers/getUsers"
import { useQuery } from "@tanstack/react-query"

export default function useUsers() {
  const { query } = useRouter()
  const page = query?.page as string
  const search = query?.search as string
  const fetcher = () => getUsers(page, search)

  const users = useQuery(["admin-users", page, search], fetcher)

  return users
}
