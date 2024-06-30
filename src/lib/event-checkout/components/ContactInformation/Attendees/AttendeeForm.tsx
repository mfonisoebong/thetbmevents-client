import { FC } from "react";
import { AttendeeFormProps } from "@lib/event-checkout/typings";
import Form from "@lib/event-checkout/components/ContactInformation/Attendees/Form";

const AttendeeForm: FC<AttendeeFormProps> = ({ ticket, index }) => {
  return (
    <div className="space-y-2">
      <div>
        <h5 className="font-semibold text-sm">{ticket.name}</h5>
        <p className="text-sm font-light text-gray-600">{ticket.description}</p>
      </div>
      <Form index={index} ticketId={ticket.id} />
    </div>
  );
};

export default AttendeeForm;
