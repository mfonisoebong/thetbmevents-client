import { FC } from "react";
import { CustomerRowProps } from "@lib/dashboard-finance/typings";
import styles from "@lib/create-event/components/TicketForm/TicketsDisplay/styles.module.css";

const TableRow: FC<CustomerRowProps> = ({ tickets, username }) => {
  return (
    <tr className={styles.tablerow}>
      <td className="w-max whitespace-nowrap">{username}</td>
      <td className="w-max whitespace-nowrap">{tickets}</td>
    </tr>
  );
};

export default TableRow;
