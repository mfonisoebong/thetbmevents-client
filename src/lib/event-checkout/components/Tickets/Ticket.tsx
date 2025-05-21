import { FC } from "react";
import styles from "./styles.module.css";
import { TicketProps } from "@lib/event-checkout/typings";
import TicketDetails from "@lib/event-checkout/components/Tickets/TicketDetails";
import QuantitySelect from "../QuantitySelect";
import useTicketsContext from "@lib/event-checkout/hooks/useTicketsContext";

const Ticket: FC<TicketProps> = ({ ticket }) => {
  const { selectedTickets, incrementQuantity, decrementQuantity } =
    useTicketsContext();
  const selectedTicket = selectedTickets.find((t) => t.id === ticket.id);
  const ticketQuantity = selectedTicket?.quantity || 0;
  const increment = () => {
    const maxQuantity = ticket.unlimited ? undefined : ticket.quantity;
    return incrementQuantity(ticket.id, maxQuantity);
  };

  const decrement = () => {
    return decrementQuantity(ticket.id);
  };

  return (
    <div className={styles.card}>
      <TicketDetails
        isSoldOut={ticket.is_sold_out}
        description={ticket.description}
        name={ticket.name}
        quantity={ticket.quantity}
        sold={ticket.sold}
        price={ticket.price}
        isEarly={ticket.is_early}
        isLate={ticket.is_late}
        salesEnd={ticket.selling_end_date_time}
        salesStart={ticket.selling_start_date_time}
      />

      <QuantitySelect
        disabled={ticket.is_early || ticket.is_late || ticket.is_sold_out}
        quantity={ticketQuantity}
        increment={increment}
        decrement={decrement}
      />
    </div>
  );
};

export default Ticket;
