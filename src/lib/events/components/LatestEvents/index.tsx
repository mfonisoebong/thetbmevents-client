import { FC } from "react";
import Section from "../Section";
import Events from "../Events";
import useEventsByLocation from "@lib/events/hooks/useEventsByLocation";
import useEventsContext from "@lib/events/hooks/useEventsContext";

const LatestEvents: FC = () => {
  const { eventData } = useEventsContext();

  if (eventData.latest_events.length === 0) {
    return null;
  }
  return (
    <Section title={"Latest Events"}>
      <Events events={eventData.latest_events} />
    </Section>
  );
};

export default LatestEvents;
