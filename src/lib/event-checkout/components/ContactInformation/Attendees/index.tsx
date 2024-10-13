import { FC, Fragment } from "react";
import useTicketsContext from "@lib/event-checkout/hooks/useTicketsContext";
import useEvent from "@lib/event/hooks/useEvent";
import AttendeeForm from "@lib/event-checkout/components/ContactInformation/Attendees/AttendeeForm";

const Attendees: FC = () => {
  const { selectedTickets } = useTicketsContext();
  const { data: eventsData } = useEvent();

  return (
    <div className={"space-y-5"}>
      <h4 className={"font-bold text-base md:text-xl"}>Attendee information</h4>
      {selectedTickets?.map((t, index) => (
        <Fragment key={t.id}>
          {Array.from({ length: t.quantity }).map((_, i) => {
            const ticket = eventsData?.tickets.find(
              (tData) => tData.id === t.id
            );

            if (!ticket) return null;

            return (
              <AttendeeForm
                key={i}
                index={i}
                ticket={{
                  id: ticket.id,
                  name: ticket.name,
                  description: ticket.description,
                }}
              />
            );
          })}
        </Fragment>
      ))}
    </div>
  );
};
export default Attendees;
