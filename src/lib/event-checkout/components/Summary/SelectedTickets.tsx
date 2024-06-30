import { FC } from "react";
import cardStyles from "@lib/event-checkout/components/Tickets/styles.module.css";
import NoSelectedTickets from "@lib/event-checkout/components/Summary/NoSelectedTickets";
import useTicketsContext from "@lib/event-checkout/hooks/useTicketsContext";
import SelectedTicket from "@lib/event-checkout/components/Summary/SelectedTicket";
import FeesSubtotal from "@lib/event-checkout/components/Summary/FeesSubtotal";
import TotalAmount from "@lib/event-checkout/components/Summary/TotalAmount";

const SelectedTickets: FC = () => {
  const { selectedTickets } = useTicketsContext();
  const noTicketsSelected = selectedTickets.length === 0;
  return (
    <div className={cardStyles.cardcontainer}>
      {noTicketsSelected && <NoSelectedTickets />}
      {!noTicketsSelected && (
        <>
          {selectedTickets.map((ticket) => (
            <SelectedTicket ticket={ticket} key={ticket.id} />
          ))}
          <FeesSubtotal />
          <TotalAmount />
        </>
      )}
    </div>
  );
};

export default SelectedTickets;
