import { EventCardProps } from "@lib/events/typings";
import { FC } from "react";
import styles from "./styles.module.css";
import Calender from "@common/components/Icons/Calender";
import Location from "@common/components/Icons/Location";
import Link from "next/link";
import useMediaQuery from "@common/hooks/useMediaQuery";
import { Device } from "@common/typings";
import Image from "next/image";
import moment from "moment";

const EventCard: FC<EventCardProps> = (props) => {
  const isMediumSize = useMediaQuery(Device.medium);
  const iconSize = isMediumSize ? 15 : 12;
  const eventDate = moment(props.event_date).format("ddd DD, YYYY MMMM");

  return (
    <div className={props.filtered ? styles.filteredcard : styles.card}>
      <Image
        width={250}
        height={250}
        unoptimized
        src={props.logo ?? "/images/no_event.png"}
        alt={props.title}
        className={props.logo ? "" : styles.noimage}
        loading="lazy"
      />
      <div className={styles.cardbody}>
        <div
          className={
            props.filtered ? styles.filteredcardtitle : styles.cardtitle
          }
        >
          <h4>
            <Link href={`/events/${props.alias}`}>{props.title}</Link>
          </h4>
        </div>
        <div className={styles.carddetails}>
          <p>
            <Calender size={iconSize} color="black" />
            <span>{eventDate}</span>
          </p>

          <p>
            <Location size={iconSize} color="black" />
            <span>{props.location}</span>
          </p>
          <div className={styles.link}>
            <Link href={`/events/${props.alias}/checkout`}>Get Tickets</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
