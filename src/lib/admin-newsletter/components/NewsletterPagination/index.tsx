import Pagination from "@common/components/Pagination"
import usePagination from "@common/hooks/usePagination"
import useNewsletterSignups from "@lib/admin-newsletter/hooks/useNewsletterSignups"
import { NewsletterPaginationProps } from "@lib/admin-newsletter/typings"
import { FC } from "react"

const NewsletterPagination: FC<NewsletterPaginationProps> = ({ data }) => {
  const { refetch, isLoading } = useNewsletterSignups()
  const {
    lastPage,
    firstPage,
    previousPage,
    hasPreviousPage,
    hasNextPage,
    nextPage,
  } = usePagination({
    last_page: data.last_page,
    prev_page_url: data.prev_page_url,
    current_page: data.current_page,
    refetchData: refetch,
    next_page_url: data.next_page_url,









  })

  return (
    <Pagination
      hasNextPage={hasNextPage}
      isLoading={isLoading}
      hasPreviousPage={hasPreviousPage}
      firstPage={firstPage}
      lastPage={lastPage}
      previousPage={previousPage}
      nextPage={nextPage}
      from={data.from}
      to={data.to}
      total={data.total}
    />
  )
}

export default NewsletterPagination
