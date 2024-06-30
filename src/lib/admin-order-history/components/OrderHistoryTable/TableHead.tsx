import { FC } from "react";
import styles from "@lib/create-event/components/TicketForm/TicketsDisplay/styles.module.css";

const TableHead: FC = () => {
  return (
    <thead className={styles.tablehead}>
      <tr>
        <th>Ticket No</th>
        <th>Event Name</th>
        <th>Ticket Name</th>
        <th>Ticket Price</th>
        <th>Organizer</th>
        <th>Date</th>
        <th></th>
      </tr>
    </thead>
  );
};

export default TableHead;
