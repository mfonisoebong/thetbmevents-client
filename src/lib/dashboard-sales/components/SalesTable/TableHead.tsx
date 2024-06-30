import { FC } from "react";
import styles from "@lib/create-event/components/TicketForm/TicketsDisplay/styles.module.css";

const TableHead: FC = () => {
  return (
    <thead className={styles.tablehead}>
      <tr>
        <th>username</th>
        <th>email</th>
        <th>ticket name</th>
        <th>price</th>
        <th>no. of tickets</th>
        <th>date</th>
      </tr>
    </thead>
  );
};

export default TableHead;
