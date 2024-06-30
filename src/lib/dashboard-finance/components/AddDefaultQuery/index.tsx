import { FC } from "react"
import { useRouter } from "next/router"
import useHydrated from "@common/hooks/useHydrated"

const AddDefaultQuery: FC = () => {
  const { query } = useRouter()
  const { hydrated } = useHydrated()
  const queryHasKeys = Object.keys(query).length > 0
  const router = useRouter()

  if (!hydrated) return null
  if (!queryHasKeys) {
    const date = new Date()
    router.push({
      query: {
        month: date.getMonth() + 1,
        year: date.getFullYear(),
      },
    })
  }

  return null
}

export default AddDefaultQuery
