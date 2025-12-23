import { FC } from "react";
import LayoutContainer from "@lib/event-checkout/components/LayoutContainer";
import styles from "./styles.module.css";
import useEvent from "@lib/event/hooks/useEvent";
import Ticket from "./Ticket";
import Continue from "@lib/event-checkout/components/Continue";
import useTotalAmount from "@lib/event-checkout/hooks/useTotalAmount";
import useTicketsContext from "@lib/event-checkout/hooks/useTicketsContext";
import { useRouter } from "next/router";
import CommonCard from "@lib/event-checkout/components/CommonCard";
import moment from "moment/moment";

const Tickets: FC = () => {
  const { data: eventsData } = useEvent();
  const router = useRouter();
  const { selectedTickets } = useTicketsContext();
  const canContinue = selectedTickets.length > 0;
  const eventDate = moment(eventsData?.event.event_date).format(
    "dddd MMMM DD, YYYY",
  );
  const proceed = () => {
    router.push({
      query: {
        ...router.query,
        view: "contact-info",
      },
    });
  };

  return (
    <LayoutContainer
      className={styles.tickets}
      title={"Choose your tickets type"}
    >
      <CommonCard title={eventDate}>
        <div className={styles.cardcontainer}>
          {eventsData?.tickets.map((t) => <Ticket ticket={t} key={t.id} />)}
        </div>
      </CommonCard>
      <Continue onClick={proceed} disabled={!canContinue} />
    </LayoutContainer>
  );
};

export default Tickets;
