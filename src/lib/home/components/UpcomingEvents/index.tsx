import Container from "@common/components/Container";
import { FC } from "react";
import Heading from "./Heading";
import SlideShow from "../../../../common/components/SlideShow";
import AttendAnEvent from "./Slides/AttendAnEvent";
import useHomeContext from "@lib/home/hooks/useHomeContext";

const UpcomingEvents: FC = () => {
  const { upcoming_events } = useHomeContext();

  return (
    <section className="bg-main">
      <Container>
        <Heading />
        <SlideShow>
          {upcoming_events.map((e) => (
            <AttendAnEvent event={e} key={e.event_id} />
          ))}
        </SlideShow>
      </Container>
    </section>
  );
};

export default UpcomingEvents;
