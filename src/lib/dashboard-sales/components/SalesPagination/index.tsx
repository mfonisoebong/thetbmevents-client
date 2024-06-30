import { FC } from "react";
import Pagination from "@common/components/Pagination";
import useSales from "@lib/dashboard-sales/hooks/useSales";
import usePagination from "@common/hooks/usePagination";
import { SalesPaginationProps } from "@lib/dashboard-sales/typings";

const SalesPagination: FC<SalesPaginationProps> = ({ data }) => {
  const { refetch, isLoading } = useSales();
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

export default SalesPagination;
