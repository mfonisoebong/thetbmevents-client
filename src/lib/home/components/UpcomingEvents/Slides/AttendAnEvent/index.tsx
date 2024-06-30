import { FC } from "react";
import styles from "../../styles.module.css";
import TimeRemaining from "./TimeRemaining";
import EventLink from "./EventLink";
import { AttendAnEventProps } from "@lib/home/typings";

const AttendAnEvent: FC<AttendAnEventProps> = ({ event }) => {

    console.log(event)

  return (
    <div
      className={styles.attend}
      style={{
        background: `url(${event.event_logo})`,
        backgroundSize: "cover",
      }}
    >
      <TimeRemaining
        ticketPrice={event.ticket.price}
        expireIn={event.expire_in}
      />
      <EventLink eventId={event.event_alias} />
    </div>
  );
};

export default AttendAnEvent;
