import { FC } from "react";
import usePagination from "@common/hooks/usePagination";
import Pagination from "@common/components/Pagination";
import { OrdersPaginationProps } from "@lib/admin-order-history/typings";
import useOrderHistory from "@lib/admin-order-history/hooks/useOrderHistory";

const OrganizersPagination: FC<OrdersPaginationProps> = ({ data }) => {
  const { refetch, isLoading } = useOrderHistory();
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
  });

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
  );
};

export default OrganizersPagination;
