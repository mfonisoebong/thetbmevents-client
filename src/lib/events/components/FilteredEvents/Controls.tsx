import Button from "@common/components/Button"
import useFilteredEvents from "@lib/events/hooks/useFilteredEvents"
import { useRouter } from "next/router"
import { FC } from "react"

const Controls: FC = () => {
  const { data: filteredEvents } = useFilteredEvents()
  const router = useRouter()
  const page = router.query.page as string
  const pageValue = page ? parseInt(page) : 1
  const lastPage = filteredEvents?.lastPage
  const isInFirstPage = pageValue === 1
  const isInLastPage = pageValue === lastPage

  const nextPage = () => {
    router.push(
      {
        query: {
          ...router.query,
          page: pageValue + 1,
        },
      },
      undefined,
      {
        shallow: true,
      }
    )
  }
  const previousPage = () => {
    router.push(
      {
        query: {
          ...router.query,

          page: pageValue - 1,
        },
      },
      undefined,
      {
        shallow: true,
      }
    )
  }

  return (
    <div className="grid grid-cols-2">
      <div>
        {!isInFirstPage && <Button onClick={previousPage}>Previous</Button>}
      </div>
      <div>
        {!isInLastPage && (
          <Button className="ml-auto" onClick={nextPage}>
            Next
          </Button>
        )}
      </div>
    </div>
  )
}
export default Controls
