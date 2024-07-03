import { FC } from "react";
import Pagination from "@common/components/Pagination";
import useCoupons from "@lib/coupons/hooks/useCoupons";
import usePagination from "@common/hooks/usePagination";

const CouponsPagination: FC = () => {
  const coupons = useCoupons();
  const {
    lastPage,
    firstPage,
    previousPage,
    hasPreviousPage,
    hasNextPage,
    nextPage,
  } = usePagination({
    last_page: coupons.data?.last_page ?? 0,
    prev_page_url: coupons.data?.prev_page_url,
    current_page: coupons.data?.current_page ?? 0,
    refetchData: coupons.refetch,
    next_page_url: coupons.data?.next_page_url,
  });

  if (!coupons.data) return null;

  return (
    <Pagination
      hasNextPage={hasNextPage}
      isLoading={coupons.isLoading}
      hasPreviousPage={hasPreviousPage}
      firstPage={firstPage}
      lastPage={lastPage}
      previousPage={previousPage}
      nextPage={nextPage}
      from={coupons.data.from}
      to={coupons.data.to}
      total={coupons.data.total}
    />
  );
};

export default CouponsPagination;
