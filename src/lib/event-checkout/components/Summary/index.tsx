import { FC } from "react";
import styles from "./styles.module.css";
import LayoutContainer from "@lib/event-checkout/components/LayoutContainer";
import EventTitle from "./EventTitle";
import SelectedTickets from "@lib/event-checkout/components/Summary/SelectedTickets";

const Summary: FC = () => {
  return (
    <LayoutContainer className={styles.summary} title={"Summary"}>
      <div>
        <EventTitle />
        <SelectedTickets />
      </div>
    </LayoutContainer>
  );
};

export default Summary;
