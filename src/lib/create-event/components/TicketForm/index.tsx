import { FC, useState } from "react";
import Tickets from "./Tickets";
import Form from "./Form";
import { useFormContext } from "react-hook-form";
import { EventFormType } from "@lib/create-event/utils/eventSchema";
import Controls from "../Controls";

const TicketForm: FC = () => {
  const [showForm, setShowForm] = useState(false);
  const { setValue, getValues } = useFormContext<EventFormType>();

  const toggleForm = () => {
    setShowForm((state) => !state);
  };

  const addTicket = () => {
    const tickets = getValues("ticket") ?? [];

    setValue("ticket", [
      ...tickets,
      {
        name: "",
        price: 0,
        unlimited: false,
        quantity: 0,
        description: "",
        sellingDate: {
          end: "",
          start: "",
        },
      },
    ]);
    toggleForm();
  };

  const close = () => {
    setShowForm((state) => !state);
  };

  return (
    <div>
      {showForm ? (
        <Form closeForm={close} />
      ) : (
        <Tickets addTicket={addTicket} />
      )}
      <Controls />
    </div>
  );
};

export default TicketForm;
