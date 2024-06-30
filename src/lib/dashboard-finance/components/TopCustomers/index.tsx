import { FC } from "react";
import styles from "@lib/create-event/components/TicketForm/TicketsDisplay/styles.module.css";
const TopCustomers: FC = () => {
  const { data: finance } = useFinanceData();

  return (
    <>
      <h3 className={"font-bold text-gray-700"}>TOP CUSTOMERS</h3>
      <div className={styles.wrapper}>
        <table className={styles.table}>
          <TableHead />
          <tbody>
            {finance?.topCustomers.map((c) => (
              <TableRow
                username={c.name}
                key={c.name + c.total_tickets}
                tickets={c.total_tickets}
              />
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};
import TableHead from "@lib/dashboard-finance/components/TopCustomers/TableHead";

import TableRow from "@lib/dashboard-finance/components/TopCustomers/TableRow";
import useFinanceData from "@lib/dashboard-finance/hooks/useFinanceData";

export default TopCustomers;
