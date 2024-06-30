import { FC } from "react";
import Section from "../Section";
import styles from "./styles.module.css";
import useEventsContext from "@lib/events/hooks/useEventsContext";
import Event from "./Event";

const TopEvents: FC = () => {
  const {
    eventData: { top_events },
  } = useEventsContext();

  if (top_events.length === 0) {
    return null;
  }

  return (
    <Section title="Top Events">
      <div className={styles.eventsgrid}>
        {top_events.map((e) => (
          <Event id={e.id} logo={e.logo} title={e.title} key={e.id} />
        ))}
      </div>
    </Section>
  );
};

export default TopEvents;
