import { FC } from "react";
import styles from "@lib/create-event/components/TicketForm/TicketsDisplay/styles.module.css";
import { TableRowProps } from "@lib/dashboard-sales/typings";
import { numberFormatter } from "@common/utils/numberFormatter";
import moment from "moment";
const TableRow: FC<TableRowProps> = (props) => {
  const boughtAt = moment(props.created_at).format("DD/MM/YYYY");

  return (
    <tr className={styles.tablerow}>
      <td className="w-max whitespace-nowrap">{props.customer.name}</td>
      <td className="w-max whitespace-nowrap">{props.customer.email}</td>
      <td className="w-max whitespace-nowrap">{props.ticket}</td>
      <td>₦{numberFormatter(props.price)}</td>
      <td>{props.tickets_bought}</td>
      <td>{boughtAt}</td>
    </tr>
  );
};

export default TableRow;
