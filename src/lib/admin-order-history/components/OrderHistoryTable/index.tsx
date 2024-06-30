import { FC } from "react";
import styles from "@lib/create-event/components/TicketForm/TicketsDisplay/styles.module.css";
import TableHead from "@lib/admin-order-history/components/OrderHistoryTable/TableHead";
import useFilterHistory from "@lib/admin-order-history/hooks/useFilterHistory";
import TableRow from "@lib/admin-order-history/components/OrderHistoryTable/TableRow";
import useMediaQuery from "@common/hooks/useMediaQuery";
import { Device } from "@common/typings";

const OrderHistoryTable: FC = () => {
  const { filteredOrders } = useFilterHistory();
  const isLarge = useMediaQuery(Device.large);
  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        {isLarge && <TableHead />}
        {filteredOrders?.map((o) => <TableRow {...o} key={o.ticket_no} />)}
      </table>
    </div>
  );
};

export default OrderHistoryTable;
