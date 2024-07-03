import { FC } from "react";
import styles from "@lib/create-event/components/TicketForm/TicketsDisplay/styles.module.css";

const TableHead: FC = () => {
  return (
    <thead className={styles.tablehead}>
      <tr>
        <th>Name</th>
        <th>Code</th>
        <th>Type</th>
        <th>Event</th>
        <th>Status</th>
        <th></th>
      </tr>
    </thead>
  );
};

export default TableHead;
