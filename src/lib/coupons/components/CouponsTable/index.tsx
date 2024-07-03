import { FC } from "react";
import styles from "@lib/create-event/components/TicketForm/TicketsDisplay/styles.module.css";
import TableHead from "./TableHead";
import useCoupons from "@lib/coupons/hooks/useCoupons";
import TableRow from "./TableRow";

const CouponsTable: FC = () => {
  const coupons = useCoupons();

  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <TableHead />
        <tbody>
          {coupons.data?.data.map((c) => <TableRow coupon={c} key={c.id} />)}
        </tbody>
      </table>
    </div>
  );
};

export default CouponsTable;
