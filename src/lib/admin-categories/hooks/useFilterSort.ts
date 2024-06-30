import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Category, SortFilter } from "../typings"
import useCategories from "./useCategories"

export default function useFilterSort() {
  const { data: usersData } = useCategories()
  const searchParams = useSearchParams()
  const sort = searchParams.get("sort") as SortFilter
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    if (!usersData?.data) return
    if (sort === "Category") {
      const sorted = usersData.data
      sorted.sort((a, b) => {
        const aName = a.category.toLowerCase()
        const bName = b.category.toLowerCase()
        if (aName < bName) return -1
        if (aName > bName) return 1

        return 0
      })

      setCategories(() => sorted)
    }

    if (sort === "Slug") {
      const sorted = usersData.data
      sorted.sort((a, b) => {
        const aEmail = a.slug.toLowerCase()
        const bEmail = b.slug.toLowerCase()
        if (aEmail < bEmail) return -1
        if (aEmail > bEmail) return 1

        return 0
      })

      setCategories(() => sorted)
    }
  }, [sort, usersData?.data])

  useEffect(() => {
    if (!usersData?.data) return

    setCategories(() => usersData.data)
  }, [usersData?.data])

  return { categories }
}
