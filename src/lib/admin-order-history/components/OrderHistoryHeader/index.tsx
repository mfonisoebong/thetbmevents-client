import { FC } from "react";
import SearchFilter from "@lib/admin-order-history/components/OrderHistoryHeader/SearchFilter";
import ExportAs from "@lib/admin-order-history/components/OrderHistoryHeader/ExportAs";

const OrderHistoryHeader: FC = () => {
  return (
    <div className={"flex flex-col lg:flex-row space-y-3 justify-between"}>
      <SearchFilter />
      <ExportAs />
    </div>
  );
};

export default OrderHistoryHeader;
