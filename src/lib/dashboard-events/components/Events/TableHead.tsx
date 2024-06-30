import { FC } from "react";
import styles from "@lib/create-event/components/TicketForm/TicketsDisplay/styles.module.css";
import useMediaQuery from "@common/hooks/useMediaQuery";
import { Device } from "@common/typings";

const TableHead: FC = () => {
  const isMedium = useMediaQuery(Device.medium);

  return (
    <thead className={styles.tablehead}>
      <tr>
        <th>EVENT THUMBNAIL</th>
        <th>EVENT name</th>
        {isMedium && (
          <>
            <th>Ticket price</th>
            <th>Date created</th>
          </>
        )}
      </tr>
    </thead>
  );
};

export default TableHead;
