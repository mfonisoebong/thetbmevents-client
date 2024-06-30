import { FC } from "react";
import OverviewCard from "@lib/dashboard-overview/components/OverviewCard";
import Details from "@lib/dashboard-ticket/components/TicketInformation/Details";
import TicketActions from "@lib/dashboard-ticket/components/TicketInformation/TicketActions";
import useTicket from "@lib/dashboard-ticket/hooks/useTicket";

const TicketInformation: FC = () => {
  const { data } = useTicket();

  return (
    <div
      data-ticketId={data?.id}
      data-event={data?.event}
      data-ticket={data?.ticket}
      id="ticket_information"
    >
      <OverviewCard theme={"light"}>
        <div className={"w-full flex flex-col lg:flex-row lg:justify-between"}>
          <Details />
          <TicketActions />
        </div>
      </OverviewCard>
    </div>
  );
};

export default TicketInformation;
