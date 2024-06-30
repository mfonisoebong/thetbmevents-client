import { FC } from "react";
import styles from "./styles.module.css";
import DoubleAngleLeft from "@common/components/Icons/DoubleAngleLeft";
import DoubleAngleRight from "@common/components/Icons/DoubleAngleRight";
import AngleLeft from "@common/components/Icons/AngleLeft";
import AngleRight from "@common/components/Icons/AngleRight";
import { PaginationProps } from "@common/typings";
const Pagination: FC<PaginationProps> = ({
  hasNextPage,
  hasPreviousPage,
  lastPage,
  nextPage,
  previousPage,
  firstPage,
  isLoading,
  total,
  to,
  from,
}) => {
  return (
    <div className={styles.pagination}>
      <p>
        {from} - {to} of {total}
      </p>
      <button disabled={isLoading} onClick={firstPage}>
        <DoubleAngleLeft size={15} />
      </button>
      <button disabled={isLoading || !hasPreviousPage} onClick={previousPage}>
        <AngleLeft size={15} />
      </button>
      <button disabled={isLoading || !hasNextPage} onClick={nextPage}>
        <AngleRight size={15} />
      </button>
      <button disabled={isLoading} onClick={lastPage}>
        <DoubleAngleRight size={15} />
      </button>
    </div>
  );
};

export default Pagination;
