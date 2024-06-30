import { FC } from "react";
import styles from "@lib/create-event/components/TicketForm/TicketsDisplay/styles.module.css";

const TableHead: FC = () => {
  return (
    <thead className={styles.tablehead}>
      <tr>
        <th>ORGANIZER NAME</th>
        <th>TICKET/EVENT NAME</th>

        <th>NO. OF TICKETS</th>
      </tr>
    </thead>
  );
};
export default TableHead;
