import { FC } from "react";
import styles from "@lib/create-event/components/TicketForm/TicketsDisplay/styles.module.css";

const TableHead: FC = () => {
  return (
    <thead className={styles.tablehead}>
      <tr>
        <th>TICKET NUMBER</th>
        <th>EVENT NAME</th>

        <th>TICKET NAME</th>
        <th>DATE PURCHASED</th>
      </tr>
    </thead>
  );
};

export default TableHead;
