import { FC } from "react";
import useTicketsContext from "@lib/event-checkout/hooks/useTicketsContext";
import useEvent from "@lib/event/hooks/useEvent";
import AttendeeForm from "@lib/event-checkout/components/ContactInformation/Attendees/AttendeeForm";

const Attendees: FC = () => {
  const { selectedTickets } = useTicketsContext();
  const { data: eventsData } = useEvent();
  const ticketIds = selectedTickets.map((t) => t.id);
  const tickets = eventsData?.tickets.filter((t) => ticketIds.includes(t.id));

  return (
    <div className={"space-y-5"}>
      <h4 className={"font-bold text-base md:text-xl"}>Attendee information</h4>
      {tickets?.map((t, index) => (
        <AttendeeForm
          index={index}
          ticket={{ id: t.id, name: t.name, description: t.description }}
          key={t.id}
        />
      ))}
    </div>
  );
};
export default Attendees;
