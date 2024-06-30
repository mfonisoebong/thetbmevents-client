import { FC } from "react";
import styles from "./styles.module.css";
import Calender from "@common/components/Icons/Calender";
import Location from "@common/components/Icons/Location";
import useMediaQuery from "@common/hooks/useMediaQuery";
import { Device } from "@common/typings";
import moment from "moment";
import useEventContext from "@lib/event/hooks/useEventContext";

const DateAndLocation: FC = () => {
  const isMediumSize = useMediaQuery(Device.medium);
  const iconSize = isMediumSize ? 15 : 12;
  const event = useEventContext();

  const commenceDateTime = event.event.event_time
    ? moment(`${event.event.event_date} ${event.event.event_time}`).format(
        "ddd, MMM DD YYYY, hh:mm a"
      )
    : moment(event.event.event_date).format("ddd, MMM DD YYYY");

  const location = () => {
    if (event?.event.undisclose_location) {
      return "Undisclosed";
    }
    if (event?.event.location) {
      return event?.event.location;
    }
    return event?.event.event_link;
  };

  return (
    <div className={styles.dateandloc}>
      <p>
        <Calender size={iconSize} color="black" />
        <span>{commenceDateTime}</span>
      </p>

      <p>
        <Location size={iconSize} color="black" />
        <span>{location()}</span>
      </p>
    </div>
  );
};

export default DateAndLocation;
