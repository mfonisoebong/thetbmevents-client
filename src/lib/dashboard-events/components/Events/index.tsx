import useUserEvents from "@lib/dashboard-events/hooks/useUserEvents";
import { FC } from "react";
import styles from "@lib/create-event/components/TicketForm/TicketsDisplay/styles.module.css";
import TableHead from "./TableHead";
import TableRow from "./TableRow";
import NoContent from "@common/components/NoContent";

const Events: FC = () => {
  const { data: events } = useUserEvents();

  if (events?.length === 0) {
    return <NoContent title="You haven't created any events" />;
  }

  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <TableHead />
        <tbody>
          {events?.map((e) => (
            <TableRow {...e} key={e.id} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Events;
