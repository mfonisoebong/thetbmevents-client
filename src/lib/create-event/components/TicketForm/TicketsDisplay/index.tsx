import { FC } from "react";
import TableHead from "./TableHead";
import styles from "./styles.module.css";
import { useFormContext } from "react-hook-form";
import {
  EventFormType,
  TicketSchema,
} from "@lib/create-event/utils/eventSchema";
import TicketRow from "./TicketRow";

const TicketsDisplay: FC = () => {
  const { watch } = useFormContext<EventFormType>();
  const tickets = watch("ticket");

  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <TableHead />
        <tbody className="w-max">
          {tickets?.map((t, i) => <TicketRow index={i} {...t} key={i} />)}
        </tbody>
      </table>
    </div>
  );
};
export default TicketsDisplay;
