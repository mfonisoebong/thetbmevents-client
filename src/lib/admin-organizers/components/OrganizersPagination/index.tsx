import { FC } from "react"
import { UsersPaginationProps } from "@lib/admin-users/typings"
import usePagination from "@common/hooks/usePagination"
import Pagination from "@common/components/Pagination"
import useOrganizers from "@lib/admin-organizers/hooks/useOrganizers"

const OrganizersPagination: FC<UsersPaginationProps> = ({ data }) => {
  const { refetch, isLoading } = useOrganizers()
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

export default OrganizersPagination
