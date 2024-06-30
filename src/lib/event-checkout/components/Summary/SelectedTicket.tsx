import { FC } from "react";
import { SelectedTicketProps } from "@lib/event-checkout/typings";
import styles from "./styles.module.css";
import useEvent from "@lib/event/hooks/useEvent";

const SelectedTicket: FC<SelectedTicketProps> = (props) => {
  const { data: eventsData } = useEvent();
  const ticket = eventsData?.tickets.find((t) => t.id === props.ticket.id);

  if (!ticket) return null;

  return (
    <div className={styles.card}>
      <p>
        {ticket.name} ({props.ticket.quantity})
      </p>
      <h5>NGN {ticket.price.toLocaleString()}</h5>
    </div>
  );
};

export default SelectedTicket;
