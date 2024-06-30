import { FC } from "react";
import styles from "@lib/create-event/components/TicketForm/TicketsDisplay/styles.module.css";

const TableHead: FC = () => {
  return (
    <thead className={styles.tablehead}>
      <tr>
        <th>USERNAME</th>
        <th>NO. OF TICKETS</th>
      </tr>
    </thead>
  );
};

export default TableHead;
