import { useQuery } from "@tanstack/react-query"
import { getCategories } from "../helpers/getCategories"

export default function useCategories() {
  const categories = useQuery(["categories"], getCategories)

  return categories
}
