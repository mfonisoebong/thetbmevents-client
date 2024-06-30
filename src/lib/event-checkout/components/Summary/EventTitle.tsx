import { FC } from "react";
import styles from "@lib/event-checkout/components/Summary/styles.module.css";
import useEvent from "@lib/event/hooks/useEvent";

const EventTitle: FC = () => {
  const { data: eventData } = useEvent();

  return (
    <div className={styles.eventtitle}>
      <h3>{eventData?.event.title}</h3>
    </div>
  );
};

export default EventTitle;
