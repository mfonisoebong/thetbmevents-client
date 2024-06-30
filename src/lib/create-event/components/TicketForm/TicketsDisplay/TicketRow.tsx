import { FC } from "react";
import styles from "./styles.module.css";
import IconButton from "@common/components/IconButton";
import Trash from "@common/components/Icons/Trash";
import { TicketRowProps } from "@lib/create-event/typings";
import {
  EventFormType,
  TicketSchema,
} from "@lib/create-event/utils/eventSchema";
import { useFormContext } from "react-hook-form";
import { currencyFormatter } from "@common/utils/currencyFormatter";
import { useMutation } from "@tanstack/react-query";
import { deleteTicket } from "@lib/edit-event/helpers/deleteTicket";
import useAlertContext from "@common/hooks/useAlertContext";
import Loader from "@common/components/Icons/Loader";
import { numberFormatter } from "@common/utils/numberFormatter";
import { errorParser } from "@common/utils/errorParser";

const TicketRow: FC<TicketRowProps> = ({ index, ...restProps }) => {
  const formValid = TicketSchema.safeParse(restProps).success;
  const { setValue, getValues } = useFormContext<EventFormType>();
  const { handleOpenAlert } = useAlertContext();
  const { mutate, isLoading } = useMutation({
    mutationFn: deleteTicket,
    onSuccess() {
      const tickets = getValues("ticket");

      const newTickets = tickets.filter((_, i) => i !== index);

      setValue("ticket", newTickets);
    },
    onError(err) {
      handleOpenAlert({
        body: errorParser(err),
        title: "Error",
        type: "error",
      });
    },
  });
  const remove = () => {
    if (restProps.id) {
      mutate({ id: restProps.id });
      return;
    }

    const tickets = getValues("ticket");

    const newTickets = tickets.filter((_, i) => i !== index);

    setValue("ticket", newTickets);
  };

  if (!formValid) return null;

  return (
    <tr className={styles.tablerow}>
      <td>{restProps.name}</td>
      <td className="relative">
        NGN {numberFormatter(restProps.price, 2)}
        <IconButton
          className="stroke-red-500 absolute right-5 top-[2.3rem]"
          icon={isLoading ? <Loader color={"black"} /> : <Trash />}
          onClick={remove}
          variant="fill"
        />
      </td>
    </tr>
  );
};

export default TicketRow;
