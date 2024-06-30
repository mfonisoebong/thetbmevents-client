import { useRouter } from "next/router"
import { getCategories } from "../helpers/getCategories"
import { useQuery } from "@tanstack/react-query"

export default function useCategories() {
  const { query } = useRouter()
  const page = query?.page as string
  const search = query?.search as string
  const fetcher = () => getCategories(page, search)

  const categories = useQuery(["admin-categories", page, search], fetcher)

  return categories
}
